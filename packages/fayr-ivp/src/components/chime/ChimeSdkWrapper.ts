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
    AudioVideoFacade,
} from "amazon-chime-sdk-js";
import throttle from "lodash/throttle";
import { hasCamPermissions } from "util/permissions/browserPermissionUtil";

import * as config from "../../config";
import { Nullable, Callback } from "../../types/global";
import {
    hasMicPermissions,
    hasOutputPermissions,
} from "../../util/permissions/browserPermissionUtil";
import { JoinInfo } from "../chimeWeb/types";
import DeviceProviderDeviceTrackingDecorator from "./DeviceProviderDeviceTrackingDecorator";
import SocketProvider from "./SocketProvider";
import { ISocketProvider } from "./types";

export type DeviceInfo = {
    label: string;
    value: string;
};

type DeviceUpdatePayload = {
    currentAudioInputDevice: Nullable<DeviceInfo>;
    currentAudioOutputDevice: Nullable<DeviceInfo>;
    currentVideoInputDevice: Nullable<DeviceInfo>;
    audioInputDevices: Array<DeviceInfo>;
    audioOutputDevices: Array<DeviceInfo>;
    videoInputDevices: Array<DeviceInfo>;
};

export type DeviceUpdateCallback = (deviceInfo: DeviceUpdatePayload) => void;

export enum Role {
    Attendee,
    Host,
}

export type Attendee = {
    attendeeId: string;
    muted: boolean;
    name: string;
    signalStrength: number;
    tileId: number;
    videoEnabled: boolean;
    videoElement: React.RefObject<HTMLVideoElement>;
    volume: number;
    role: Role;
};

export type RosterMap = {
    [key: string]: Attendee;
};

type RosterUpdateCallback = Callback<RosterMap>;

type MessageUpdate = {
    type: any;
    payload: any;
    timestampMs: number;
    name: Nullable<string>;
};

type MessageUpdateCallback = Callback<MessageUpdate>;

export interface IChimeSocket {
    joinRoomSocket(): Promise<Nullable<ISocketProvider>>;
}

export interface IChimeSdkWrapper extends IChimeSocket {
    audioVideo: AudioVideoFacade;
    meetingSession: Nullable<DefaultMeetingSession>;
    attendeeId?: Nullable<string>;

    subscribeToRosterUpdate(callback: RosterUpdateCallback): number;
    unsubscribeFromRosterUpdate(callback: RosterUpdateCallback): void;

    subscribeToDevicesUpdated(callback: DeviceUpdateCallback): void;
    unsubscribeFromDevicesUpdated(callback: DeviceUpdateCallback): void;

    leaveRoom(end: boolean): Promise<void>;
}

export interface IChimeDevicePicker {
    chooseAudioInputDevice(device: Nullable<DeviceInfo>): Promise<void>;
    chooseAudioOutputDevice(device: Nullable<DeviceInfo>): Promise<void>;
    chooseVideoInputDevice(device: Nullable<DeviceInfo>): Promise<void>;
}

export interface IChimeAudioVideoProvider {
    currentAudioInputDevice: Nullable<DeviceInfo>;
    currentVideoInputDevice: Nullable<DeviceInfo>;
    currentAudioOutputDevice: Nullable<DeviceInfo>;

    audioInputDevices: Array<DeviceInfo>;
    audioOutputDevices: Array<DeviceInfo>;
    videoInputDevices: Array<DeviceInfo>;
}

export interface IDeviceProvider {
    listAudioInputDevices(): Promise<MediaDeviceInfo[]>;
    listVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    listAudioOutputDevices(): Promise<MediaDeviceInfo[]>;
}

export default class ChimeSdkWrapper
    implements
        IChimeSdkWrapper,
        IChimeSocket,
        IChimeDevicePicker,
        IChimeAudioVideoProvider,
        IDeviceProvider
{
    private static WEB_SOCKET_TIMEOUT_MS = 10000;
    private static ROSTER_THROTTLE_MS = 400;

    private _meetingSession: Nullable<DefaultMeetingSession> = null;
    public get meetingSession() {
        return this._meetingSession;
    }

    private _audioVideo: Nullable<AudioVideoFacade> = null;
    public get audioVideo() {
        return this._audioVideo!;
    }

    public get attendeeId() {
        return this.configuration?.credentials?.attendeeId;
    }

    private title: Nullable<string> = null;
    private name: Nullable<string> = null;
    private region: Nullable<string> = null;

    // Selected devices
    private _currentAudioInputDevice: Nullable<DeviceInfo> = null;
    public get currentAudioInputDevice() {
        return this._currentAudioInputDevice;
    }
    private _currentAudioOutputDevice: Nullable<DeviceInfo> = null;
    public get currentAudioOutputDevice() {
        return this._currentVideoInputDevice;
    }
    private _currentVideoInputDevice: Nullable<DeviceInfo> = null;
    public get currentVideoInputDevice() {
        return this._currentVideoInputDevice;
    }

    // Available devices
    private _audioInputDevices: Array<DeviceInfo> = [];
    public get audioInputDevices() {
        return this._audioInputDevices;
    }
    public set audioInputDevices(devices: Array<DeviceInfo>) {
        this._audioInputDevices = devices;
        this.publishDevicesUpdated();
    }
    private _audioOutputDevices: Array<DeviceInfo> = [];
    public get audioOutputDevices() {
        return this._audioOutputDevices;
    }
    public set audioOutputDevices(devices: Array<DeviceInfo>) {
        this._audioOutputDevices = devices;
        this.publishDevicesUpdated();
    }
    private _videoInputDevices: Array<DeviceInfo> = [];
    public get videoInputDevices() {
        return this._videoInputDevices;
    }
    public set videoInputDevices(devices: Array<DeviceInfo>) {
        this._videoInputDevices = devices;
        this.publishDevicesUpdated();
    }

    private devicesUpdatedCallbacks: Array<DeviceUpdateCallback> = [];
    private roster: RosterMap = {};
    private rosterUpdateCallbacks: Array<RosterUpdateCallback> = [];
    private configuration: Nullable<MeetingSessionConfiguration> = null;
    private messagingSocket: Nullable<ReconnectingPromisedWebSocket> = null;
    private messageUpdateCallbacks: Array<MessageUpdateCallback> = [];

    private _permissionGranter: IDeviceProvider;

    constructor() {
        this._permissionGranter = new DeviceProviderDeviceTrackingDecorator(this);
    }

    listAudioInputDevices() {
        return this._permissionGranter.listAudioInputDevices();
    }
    listVideoInputDevices(): Promise<MediaDeviceInfo[]> {
        return this._permissionGranter.listVideoInputDevices();
    }
    listAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
        return this._permissionGranter.listAudioOutputDevices();
    }

    resetFields() {
        this._meetingSession = null;
        this._audioVideo = null;
        this.title = null;
        this.name = null;
        this.region = null;
        this._currentAudioInputDevice = null;
        this._currentAudioOutputDevice = null;
        this._currentVideoInputDevice = null;
        this._audioInputDevices = [];
        this._audioOutputDevices = [];
        this._videoInputDevices = [];
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

    public async createRoom(
        role: string,
        name: string,
        title: string,
        playbackURL: string,
        region?: string,
    ) {
        if (!name || !title || !role) {
            console.error(`role=${role} name=${name} title=${title} must exist`);
            return;
        }

        const payload = {
            name,
            title,
            playbackURL,
            role,
        };

        const response = await fetch(`${config.CHIME_ROOM_API}/join`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error);
        }

        const { JoinInfo } = json;

        if (!JoinInfo) {
            throw new Error("CreateOrJoin.classRoomDoesNotExist");
        }
        this.configuration = new MeetingSessionConfiguration(JoinInfo.Meeting, JoinInfo.Attendee);
        await this.initializeMeetingSession(this.configuration);

        this.title = title;
        this.name = name;
        this.region = region ?? null;

        return JoinInfo;
    }

    async reInitializeMeetingSession(joinInfo: JoinInfo, name: string) {
        this.configuration = new MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee);
        await this.initializeMeetingSession(this.configuration);

        this.title = joinInfo.Title;
        this.name = name;
        // this.region = region;
    }

    private initDevicesIfAllowed = async function (
        permissionChecker: () => Promise<boolean>,
        deviceGatherer: () => Promise<Array<MediaDeviceInfo>>,
        field: Array<DeviceInfo>,
    ) {
        if (await permissionChecker()) {
            field = (await deviceGatherer()).map((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }
    };

    async initializeMeetingSession(configuration: MeetingSessionConfiguration) {
        const logger = new ConsoleLogger("SDK", LogLevel.ERROR);
        const deviceController = new DefaultDeviceController(logger);
        this._meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
        this._audioVideo = this._meetingSession.audioVideo;

        this._audioInputDevices = [];
        this._audioOutputDevices = [];
        this._videoInputDevices = [];

        // How annoying do you want to be? Javascript "this" scope: Yes
        const that = this;
        await Promise.all([
            this.initDevicesIfAllowed(
                hasMicPermissions,
                function () {
                    return that.listAudioInputDevices();
                },
                this.audioInputDevices,
            ),
            this.initDevicesIfAllowed(
                hasOutputPermissions,
                function () {
                    return that.listAudioOutputDevices();
                },
                this.audioOutputDevices,
            ),
            this.initDevicesIfAllowed(
                hasCamPermissions,
                function () {
                    return that.listVideoInputDevices();
                },
                this.videoInputDevices,
            ),
        ]);

        this.publishDevicesUpdated();
        this._audioVideo.addDeviceChangeObserver(this);

        this._audioVideo.realtimeSubscribeToAttendeeIdPresence((presentAttendeeId, present) => {
            if (!present) {
                delete this.roster[presentAttendeeId];
                //this.publishRosterUpdate.cancel();
                this.publishRosterUpdate()();
                return;
            }

            this._audioVideo?.realtimeSubscribeToVolumeIndicator(
                presentAttendeeId,
                async (attendeeId, volume, muted, signalStrength) => {
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
                        this.roster[attendeeId] = { name: "", role: Role.Attendee } as Attendee;
                    }
                    if (volume !== null) {
                        this.roster[attendeeId].volume = Math.round(volume * 100);
                    }
                    if (muted !== null) {
                        this.roster[attendeeId].muted = muted;
                    }
                    if (signalStrength !== null) {
                        this.roster[attendeeId].signalStrength = Math.round(signalStrength * 100);
                    }

                    if (this.title && attendeeId && !this.roster[attendeeId].name) {
                        const response = await fetch(
                            `${config.CHIME_ROOM_API}/attendee?title=${encodeURIComponent(
                                this.title,
                            )}&attendeeId=${encodeURIComponent(attendeeId)}`,
                        );
                        const json = await response.json();
                        const attendee = this.roster[attendeeId];
                        if (json.AttendeeInfo && attendee) {
                            attendee.name = json.AttendeeInfo.Name || "";

                            let role = Role.Attendee;
                            if ((json.AttendeeInfo.Role || "") === "host") {
                                role = Role.Host;
                            }
                            attendee.role = role;

                            shouldPublishImmediately = true;
                        }
                    }

                    if (shouldPublishImmediately) {
                        //this.publishRosterUpdate.cancel();
                    }

                    this.publishRosterUpdate()();
                },
            );
        });
    }

    async joinRoom(element: HTMLAudioElement) {
        if (!element) {
            this.logError(new Error(`element does not exist`));
            return;
        }

        window.addEventListener("unhandledrejection", (event) => {
            this.logError(event.reason);
        });

        this.publishDevicesUpdated();

        this._audioVideo?.bindAudioElement(element);
        this._audioVideo?.start();
    }

    async joinRoomSocket() {
        if (!this.configuration) {
            this.logError(new Error("configuration does not exist"));
            return null;
        }

        const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${
            this.configuration.meetingId
        }&AttendeeId=${this.configuration.credentials!.attendeeId}&JoinToken=${
            this.configuration.credentials!.joinToken
        }`;

        this.messagingSocket = new ReconnectingPromisedWebSocket(
            messagingUrl,
            [],
            "arraybuffer",
            new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
            new FullJitterBackoff(1000, 0, 10000),
        );

        await this.messagingSocket.open(ChimeSdkWrapper.WEB_SOCKET_TIMEOUT_MS);

        if (config.DEBUG) {
            console.log(this.messagingSocket);
        }

        return new SocketProvider(this.messagingSocket);
    }

    sendMessage(type: any, payload: any) {
        if (!this.messagingSocket) {
            return;
        }

        const message = {
            message: "sendmessage",
            data: JSON.stringify({ type, payload }),
        };

        try {
            this.messagingSocket.send(JSON.stringify(message));
        } catch (error) {
            this.logError(error);
        }
    }

    async leaveRoom(end: boolean) {
        try {
            this._audioVideo?.stop();
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
                        method: "POST",
                    },
                );
            }
        } catch (error) {
            this.logError(error);
        }

        this.resetFields();
    }

    // Device

    chooseAudioInputDevice = async (device: Nullable<DeviceInfo>) => {
        try {
            await this._audioVideo?.chooseAudioInputDevice(device?.value ?? null);
            this._currentAudioInputDevice = device;
        } catch (error) {
            this.logError(error);
        }
    };

    chooseAudioOutputDevice = async (device: Nullable<DeviceInfo>) => {
        try {
            await this._audioVideo?.chooseAudioOutputDevice(device?.value ?? null);
            this._currentAudioOutputDevice = device;
        } catch (error) {
            this.logError(error);
        }
    };

    chooseVideoInputDevice = async (device: Nullable<DeviceInfo>) => {
        try {
            await this._audioVideo?.chooseVideoInputDevice(device?.value ?? null);
            this._currentVideoInputDevice = device;
        } catch (error) {
            this.logError(error);
        }
    };

    // Observer methods

    audioInputsChanged(freshAudioInputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._audioInputDevices = freshAudioInputDeviceList.map((mediaDeviceInfo) => {
            if (
                this.currentAudioInputDevice &&
                mediaDeviceInfo.deviceId === this.currentAudioInputDevice.value
            ) {
                hasCurrentDevice = true;
            }
            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentAudioInputDevice =
                this._audioInputDevices.length > 0 ? this._audioInputDevices[0] : null;
        }
        this.publishDevicesUpdated();
    }

    audioOutputsChanged(freshAudioOutputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._audioOutputDevices = freshAudioOutputDeviceList.map((mediaDeviceInfo) => {
            if (
                this.currentAudioOutputDevice &&
                mediaDeviceInfo.deviceId === this.currentAudioOutputDevice.value
            ) {
                hasCurrentDevice = true;
            }

            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentAudioOutputDevice =
                this._audioOutputDevices.length > 0 ? this._audioOutputDevices[0] : null;
        }
        this.publishDevicesUpdated();
    }

    videoInputsChanged(freshVideoInputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._videoInputDevices = freshVideoInputDeviceList.map((mediaDeviceInfo) => {
            if (
                this._currentVideoInputDevice &&
                mediaDeviceInfo.deviceId === this._currentVideoInputDevice.value
            ) {
                hasCurrentDevice = true;
            }

            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentVideoInputDevice =
                this._videoInputDevices.length > 0 ? this._videoInputDevices[0] : null;
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
            currentAudioInputDevice: this._currentAudioInputDevice,
            currentAudioOutputDevice: this._currentAudioOutputDevice,
            currentVideoInputDevice: this._currentVideoInputDevice,
            audioInputDevices: this._audioInputDevices,
            audioOutputDevices: this._audioOutputDevices,
            videoInputDevices: this._videoInputDevices,
        };

        this.devicesUpdatedCallbacks.forEach((cb) => cb(params));
    }

    subscribeToRosterUpdate = (callback: RosterUpdateCallback) =>
        this.rosterUpdateCallbacks.push(callback);

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
