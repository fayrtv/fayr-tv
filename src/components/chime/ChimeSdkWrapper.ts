import {
	ConsoleLogger,
	DefaultDeviceController,
	DefaultDOMWebSocketFactory,
	DefaultMeetingSession,
	DefaultModality,
	DefaultPromisedWebSocketFactory,
	FullJitterBackoff,
	LogLevel,
	MeetingSessionConfiguration,
	ReconnectingPromisedWebSocket,
	AudioVideoFacade
} from "amazon-chime-sdk-js";

import throttle from "lodash/throttle";
import { Nullable, Callback } from "../../types/global";
import * as config from "../../config";
import { JoinInfo } from "../chimeWeb/types";

export type DeviceInfo = {
	label: string;
	value: string;
}

type DeviceUpdatePayload = {
	currentAudioInputDevice: Nullable<DeviceInfo>,
	currentAudioOutputDevice: Nullable<DeviceInfo>,
	currentVideoInputDevice: Nullable<DeviceInfo>,
	audioInputDevices: Array<DeviceInfo>,
	audioOutputDevices: Array<DeviceInfo>,
	videoInputDevices: Array<DeviceInfo>
}

export type DeviceUpdateCallback = (deviceInfo: DeviceUpdatePayload) => void;

type Participant = {
	muted: boolean;
	name: string;
	signalStrength: number;
	volume: number;
}

type RosterMap = {
	[key: string]: Participant;
}

type RosterUpdateCallback = Callback<RosterMap>;

type MessageUpdate = {
	type: any,
	payload: any,
	timestampMs: number;
	name: Nullable<string>;
};

type MessageUpdateCallback = Callback<MessageUpdate>;

export default class ChimeSdkWrapper {
	private static WEB_SOCKET_TIMEOUT_MS = 10000;
	private static ROSTER_THROTTLE_MS = 400;

	private meetingSession: Nullable<DefaultMeetingSession> = null;
	private audioVideo: Nullable<AudioVideoFacade> = null;
	private title: Nullable<string> = null;
	private name: Nullable<string> = null;
	private region: Nullable<string> = null;

	private currentAudioInputDevice: Nullable<DeviceInfo> = null;
	private currentAudioOutputDevice: Nullable<DeviceInfo> = null;
	private currentVideoInputDevice: Nullable<DeviceInfo> = null;	
	private audioInputDevices: Array<DeviceInfo> = [];
	private audioOutputDevices: Array<DeviceInfo> = [];
	private videoInputDevices: Array<DeviceInfo> = [];

	private devicesUpdatedCallbacks: Array<DeviceUpdateCallback> = [];
	private roster: RosterMap = {};
	private rosterUpdateCallbacks: Array<RosterUpdateCallback> = [];
	private configuration: Nullable<MeetingSessionConfiguration> = null;
	private messagingSocket: Nullable<ReconnectingPromisedWebSocket> = null;
	private messageUpdateCallbacks: Array<MessageUpdateCallback> = [];

	resetFields() {
		this.meetingSession = null;
		this.audioVideo = null;
		this.title = null;
		this.name = null;
		this.region = null;
		this.currentAudioInputDevice = null;
		this.currentAudioOutputDevice = null;
		this.currentVideoInputDevice = null;
		this.audioInputDevices = [];
		this.audioOutputDevices = [];
		this.videoInputDevices = [];
		this.devicesUpdatedCallbacks = [];
		this.roster = {};
		this.rosterUpdateCallbacks = [];
		this.configuration = null;
		this.messagingSocket = null;
		this.messageUpdateCallbacks = [];
	}

	logError(error: any) {
		console.error(error);
	}

	public async createRoom(role: string, name: string, title: string, playbackURL: string, region: string) {
		if (!name || !title || !role) {
			console.error(`role=${role} name=${name} title=${title} must exist`);
			return;
		}

		const payload = {
			name,
			title,
			playbackURL,
			role
		};

		const response = await fetch(`${config.CHIME_ROOM_API}/join`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		const json = await response.json();

		if (json.error) {
			throw new Error(json.error);
		}

		const { JoinInfo }: { JoinInfo: JoinInfo } = json;

		if (!JoinInfo) {
			throw new Error('CreateOrJoin.classRoomDoesNotExist');
		}
		this.configuration = new MeetingSessionConfiguration(
			JoinInfo.Meeting,
			JoinInfo.Attendee
		);
		await this.initializeMeetingSession(this.configuration);

		this.title = title;
		this.name = name;
		this.region = region;

		return JoinInfo;
	}

	async reInitializeMeetingSession(joinInfo: JoinInfo, name: string) {
		this.configuration = new MeetingSessionConfiguration(
			joinInfo.Meeting,
			joinInfo.Attendee
		);
		await this.initializeMeetingSession(this.configuration);

		this.title = joinInfo.Title;
		this.name = name;
		// this.region = region;
	}

	async initializeMeetingSession(configuration: MeetingSessionConfiguration) {

		const logger = new ConsoleLogger('SDK', LogLevel.ERROR);
		const deviceController = new DefaultDeviceController(logger);
		this.meetingSession = new DefaultMeetingSession(
			configuration,
			logger,
			deviceController
		);
		this.audioVideo = this.meetingSession.audioVideo;

		this.audioInputDevices = [];
		(await this.audioVideo.listAudioInputDevices()).forEach(
			(mediaDeviceInfo) => {
				this.audioInputDevices.push({
					label: mediaDeviceInfo.label,
					value: mediaDeviceInfo.deviceId
				});
			}
		);
		this.audioOutputDevices = [];
		(await this.audioVideo.listAudioOutputDevices()).forEach(
			(mediaDeviceInfo) => {
				this.audioOutputDevices.push({
					label: mediaDeviceInfo.label,
					value: mediaDeviceInfo.deviceId
				});
			}
		);
		this.videoInputDevices = [];
		(await this.audioVideo.listVideoInputDevices()).forEach(
			(mediaDeviceInfo) => {
				this.videoInputDevices.push({
					label: mediaDeviceInfo.label,
					value: mediaDeviceInfo.deviceId
				});
			}
		);
		this.publishDevicesUpdated();
		this.audioVideo.addDeviceChangeObserver(this);

		this.audioVideo.realtimeSubscribeToAttendeeIdPresence(
			(presentAttendeeId, present) => {
				if (!present) {
					delete this.roster[presentAttendeeId];
					//this.publishRosterUpdate.cancel();
					this.publishRosterUpdate()();
					return;
				}

				this.audioVideo?.realtimeSubscribeToVolumeIndicator(presentAttendeeId, async (
						attendeeId,
						volume,
						muted,
						signalStrength
					) => {
						const baseAttendeeId = new DefaultModality(attendeeId).base();
						if (baseAttendeeId !== attendeeId) {
							// Don't include the content attendee in the roster.
							//
							// When you or other attendees share content (a screen capture, a video file,
							// or any other MediaStream object), the content attendee (attendee-id#content) joins the session and
							// shares content as if a regular attendee shares a video.
							//
							// For example, your attendee ID is "my-id". When you call meetingSession.audioVideo.startContentShare,
							// the content attendee "my-id#content" will join the session and share your content.
							return;
						}

						let shouldPublishImmediately = false;

						if (!this.roster[attendeeId]) {
							this.roster[attendeeId] = { name: '' } as Participant;
						}
						if (volume !== null) {
							this.roster[attendeeId].volume = Math.round(volume * 100);
						}
						if (muted !== null) {
							this.roster[attendeeId].muted = muted;
						}
						if (signalStrength !== null) {
							this.roster[attendeeId].signalStrength = Math.round(
								signalStrength * 100
							);
						}
						if (this.title && attendeeId && !this.roster[attendeeId].name) {
							const response = await fetch(
								`${config.CHIME_ROOM_API}/attendee?title=${encodeURIComponent(
									this.title
								)}&attendeeId=${encodeURIComponent(attendeeId)}`
							);
							const json = await response.json();
							if (json.AttendeeInfo && this.roster[attendeeId]) {
								this.roster[attendeeId].name = json.AttendeeInfo.Name || '';
								shouldPublishImmediately = true;
							}
						}

						if (shouldPublishImmediately) {
							//this.publishRosterUpdate.cancel();
						}

						this.publishRosterUpdate()();
					}
				);
			}
		);
	}

	async joinRoom(element: HTMLAudioElement) {
		if (!element) {
			this.logError(new Error(`element does not exist`));
			return;
		}

		window.addEventListener(
			'unhandledrejection',
			(event) => {
				this.logError(event.reason);
			}
		);

		const audioInputs = await this.audioVideo?.listAudioInputDevices();
		if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
			this.currentAudioInputDevice = {
				label: audioInputs[0].label,
				value: audioInputs[0].deviceId
			};
			await this.audioVideo?.chooseAudioInputDevice(audioInputs[0].deviceId);
		}

		const audioOutputs = await this.audioVideo?.listAudioOutputDevices();
		if (audioOutputs && audioOutputs.length > 0 && audioOutputs[0].deviceId) {
			this.currentAudioOutputDevice = {
				label: audioOutputs[0].label,
				value: audioOutputs[0].deviceId
			};
			await this.audioVideo?.chooseAudioOutputDevice(audioOutputs[0].deviceId);
		}

		const videoInputs = await this.audioVideo?.listVideoInputDevices();
		if (videoInputs && videoInputs.length > 0 && videoInputs[0].deviceId) {
			this.currentVideoInputDevice = {
				label: videoInputs[0].label,
				value: videoInputs[0].deviceId
			};
			await this.audioVideo?.chooseVideoInputDevice(null);
		}

		this.publishDevicesUpdated();

		this.audioVideo?.bindAudioElement(element);
		this.audioVideo?.start();
	}

	async joinRoomMessaging() {
		if (!this.configuration) {
			this.logError(new Error('configuration does not exist'));
			return;
		}

		const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${this.configuration.meetingId}&AttendeeId=${this.configuration.credentials!.attendeeId}&JoinToken=${this.configuration.credentials!.joinToken}`;

		this.messagingSocket = new ReconnectingPromisedWebSocket(
			messagingUrl,
			[],
			'arraybuffer',
			new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
			new FullJitterBackoff(1000, 0, 10000),
		);

		await this.messagingSocket.open(ChimeSdkWrapper.WEB_SOCKET_TIMEOUT_MS);

		this.messagingSocket.addEventListener('message', (event: any) => {
			try {
				const data = JSON.parse(event.data);
				const { attendeeId } = data.payload;

				let name: Nullable<string> = null;
				if (this.roster[attendeeId]) {
					name = this.roster[attendeeId].name;
				}

				this.publishMessageUpdate({
					type: data.type,
					payload: data.payload,
					timestampMs: Date.now(),
					name
				});
			} catch (error) {
				this.logError(error);
			}
		});
	}

	sendMessage(type: any, payload: any) {
		if (!this.messagingSocket) {
			return;
		}

		const message = {
			message: 'sendmessage',
			data: JSON.stringify({ type, payload })
		};

		try {
			this.messagingSocket.send(JSON.stringify(message));
		} catch (error) {
			this.logError(error);
		}
	}

	async leaveRoom(end: boolean) {
		try {
			this.audioVideo?.stop();
		} catch (error) {
			this.logError(error);
		}

		// try {
		//   await this.messagingSocket.close(this.WEB_SOCKET_TIMEOUT_MS);
		// } catch (error) {
		//   this.logError(error);
		// }

		try {
			if (end && this.title) {
				await fetch(
					`${config.CHIME_ROOM_API}/end?title=${encodeURIComponent(this.title)}`,
					{
						method: 'POST'
					}
				);
			}
		} catch (error) {
			this.logError(error);
		}

		this.resetFields();
	}

	// Device

	async chooseAudioInputDevice(device: DeviceInfo) {
		try {
			await this.audioVideo?.chooseAudioInputDevice(device.value);
			this.currentAudioInputDevice = device;
		} catch (error) {
			this.logError(error);
		}
	}

	async chooseAudioOutputDevice(device: DeviceInfo) {
		try {
			await this.audioVideo?.chooseAudioOutputDevice(device.value);
			this.currentAudioOutputDevice = device;
		} catch (error) {
			this.logError(error);
		}
	}

	async chooseVideoInputDevice(device: DeviceInfo) {
		try {
			await this.audioVideo?.chooseVideoInputDevice(device.value);
			this.currentVideoInputDevice = device;
		} catch (error) {
			this.logError(error);
		}
	}

	// Observer methods

	audioInputsChanged(freshAudioInputDeviceList: Array<MediaDeviceInfo>) {
		let hasCurrentDevice = false;

		this.audioInputDevices = freshAudioInputDeviceList.map((mediaDeviceInfo) => {
			if (this.currentAudioInputDevice && mediaDeviceInfo.deviceId === this.currentAudioInputDevice.value) {
				hasCurrentDevice = true;
			}
			return {
				label: mediaDeviceInfo.label,
				value: mediaDeviceInfo.deviceId
			};
		});

		if (!hasCurrentDevice) {
			this.currentAudioInputDevice = this.audioInputDevices.length > 0 ? this.audioInputDevices[0] : null;
		}
		this.publishDevicesUpdated();
	}

	audioOutputsChanged(freshAudioOutputDeviceList: Array<MediaDeviceInfo>) {
		let hasCurrentDevice = false;

		this.audioOutputDevices = freshAudioOutputDeviceList.map((mediaDeviceInfo) => {
			if (this.currentAudioOutputDevice && mediaDeviceInfo.deviceId === this.currentAudioOutputDevice.value) {
				hasCurrentDevice = true;
			}

			return {
				label: mediaDeviceInfo.label,
				value: mediaDeviceInfo.deviceId
			};
		});

		if (!hasCurrentDevice) {
			this.currentAudioOutputDevice = this.audioOutputDevices.length > 0 ? this.audioOutputDevices[0] : null;
		}
		this.publishDevicesUpdated();
	}

	videoInputsChanged(freshVideoInputDeviceList: Array<MediaDeviceInfo>) {
		let hasCurrentDevice = false;
		
		this.videoInputDevices = freshVideoInputDeviceList.map((mediaDeviceInfo) => {
			if (this.currentVideoInputDevice && mediaDeviceInfo.deviceId === this.currentVideoInputDevice.value) {
				hasCurrentDevice = true;
			}

			return {
				label: mediaDeviceInfo.label,
				value: mediaDeviceInfo.deviceId
			};
		});

		if (!hasCurrentDevice) {
			this.currentVideoInputDevice = this.videoInputDevices.length > 0 ? this.videoInputDevices[0] : null;
		}

		this.publishDevicesUpdated();
	}

	// Subscribe and unsubscribe

	subscribeToDevicesUpdated(callback: DeviceUpdateCallback) {
		this.devicesUpdatedCallbacks.push(callback);
	}

	unsubscribeFromDevicesUpdated(callback: DeviceUpdateCallback) {
		const index = this.devicesUpdatedCallbacks.indexOf(callback);
		if (index !== -1) {
			this.devicesUpdatedCallbacks.splice(index, 1);
		}
	}

	publishDevicesUpdated() {
		const params: DeviceUpdatePayload = {
			currentAudioInputDevice: this.currentAudioInputDevice,
			currentAudioOutputDevice: this.currentAudioOutputDevice,
			currentVideoInputDevice: this.currentVideoInputDevice,
			audioInputDevices: this.audioInputDevices,
			audioOutputDevices: this.audioOutputDevices,
			videoInputDevices: this.videoInputDevices
		};

		this.devicesUpdatedCallbacks.forEach(cb => cb(params));
	}

	subscribeToRosterUpdate = (callback: RosterUpdateCallback) => this.rosterUpdateCallbacks.push(callback);

	unsubscribeFromRosterUpdate(callback: RosterUpdateCallback) {
		const index = this.rosterUpdateCallbacks.indexOf(callback);
		if (index !== -1) {
			this.rosterUpdateCallbacks.splice(index, 1);
		}
	}

	publishRosterUpdate() {
		return throttle(() => {
			for (const cb of this.rosterUpdateCallbacks) {
				cb(this.roster);
			}
		}, ChimeSdkWrapper.ROSTER_THROTTLE_MS);
	}

	subscribeToMessageUpdate(callback: MessageUpdateCallback) {
		this.messageUpdateCallbacks.push(callback);
	}

	unsubscribeFromMessageUpdate(callback: MessageUpdateCallback) {
		const index = this.messageUpdateCallbacks.indexOf(callback);
		if (index !== -1) {
			this.messageUpdateCallbacks.splice(index, 1);
		}
	}

	publishMessageUpdate(message: MessageUpdate) {
		for (const cb of this.messageUpdateCallbacks) {
			cb(message);
		}
	}
}
