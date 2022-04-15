import {
    DefaultDeviceController,
    DefaultMeetingSession,
    DefaultModality,
    Logger,
    MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import * as config from "config";
import { inject, injectable } from "inversify";
import { throttle } from "lodash";
import { Nullable } from "types/global";
import Types from "types/inject";

import { JoinInfo } from "components/chimeWeb/types";

import LogProvider from "./LogProvider";
import IAudioVideoManager from "./interfaces/IAudioVideoManager";
import IChimeEvents from "./interfaces/IChimeEvents";
import IRoomManager, { RosterMap, RosterUpdateCallback } from "./interfaces/IRoomManager";
import { Attendee, Role } from "./types";

@injectable()
export default class RoomManager implements IRoomManager {
    private _configuration: Nullable<MeetingSessionConfiguration> = null;
    public get configuration(): MeetingSessionConfiguration {
        return this._configuration!;
    }

    public get attendeeId(): Nullable<string> {
        return this._configuration?.credentials?.attendeeId ?? null;
    }

    private static ROSTER_UPDATE_THROTTLE_MS = 400;

    private _title: Nullable<string> = null;
    private _name: Nullable<string> = null;
    private _region: Nullable<string> = null;
    private _meetingSession: Nullable<DefaultMeetingSession> = null;

    private _audioVideoManager: IAudioVideoManager;
    private _logger: Logger;
    private _chimeEvents: IChimeEvents;

    private _roster: RosterMap = {};
    public get roster(): RosterMap {
        return this._roster;
    }
    private _rosterUpdateCallbacks: Array<RosterUpdateCallback> = [];

    public constructor(
        @inject(Types.LogProvider) logProvider: LogProvider,
        @inject(Types.IAudioVideoManager) audioVideoManager: IAudioVideoManager,
        @inject(Types.IChimeEvents) chimeEvents: IChimeEvents,
    ) {
        this._logger = logProvider.logger;
        this._audioVideoManager = audioVideoManager;
        this._chimeEvents = chimeEvents;

        chimeEvents.roomLeft.register(this.cleanUp);
    }

    private cleanUp = () => {
        this._title = null;
        this._name = null;
        this._region = null;
        this._roster = {};
        this._rosterUpdateCallbacks = [];
        this._configuration = null;
        this._meetingSession = null;

        window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
    };

    public async createRoom(
        role: string,
        name: string,
        title: string,
        playbackURL?: string,
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
        this._configuration = new MeetingSessionConfiguration(JoinInfo.Meeting, JoinInfo.Attendee);
        await this.initializeMeetingSession(this._configuration);

        this._title = title;
        this._name = name;
        this._region = region ?? null;

        return JoinInfo;
    }

    public async joinRoom(element: HTMLAudioElement) {
        if (!element) {
            this._logger.error(`element does not exist`);
            return;
        }

        window.addEventListener("unhandledrejection", this.onUnhandledRejection);

        await this._audioVideoManager.initializeMeetingSession();

        this._audioVideoManager.audioVideo?.bindAudioElement(element);
        this._audioVideoManager.audioVideo?.start();
    }

    private onUnhandledRejection = (event: PromiseRejectionEvent) =>
        this._logger.error(event.reason);

    public async leaveRoom(end: boolean) {
        try {
            this._audioVideoManager.audioVideo?.stop();
        } catch (error: any) {
            this._logger.error(error);
        }

        // try {
        //   await this.messagingSocket.close(this.WEB_SOCKET_TIMEOUT_MS);
        // } catch (error) {
        //   this.logError(error);
        // }

        try {
            if (end && this._title) {
                await fetch(
                    `${config.CHIME_ROOM_API}/end?title=${encodeURIComponent(this._title)}`,
                    {
                        method: "POST",
                    },
                );
            }
        } catch (error: any) {
            this._logger.error(error);
        }

        this._chimeEvents.roomLeft.publish();
    }

    public async reInitializeMeetingSession(joinInfo: JoinInfo, name: string) {
        this._configuration = new MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee);
        await this.initializeMeetingSession(this._configuration);

        this._title = joinInfo.Title;
        this._name = name;
    }

    private publishRosterUpdate = () =>
        throttle(() => {
            for (const cb of this._rosterUpdateCallbacks) {
                cb(this._roster);
            }
        }, RoomManager.ROSTER_UPDATE_THROTTLE_MS);

    public subscribeToRosterUpdate = (callback: RosterUpdateCallback) => {
        this._rosterUpdateCallbacks.push(callback);
        return callback;
    };

    public unsubscribeFromRosterUpdate(callback: RosterUpdateCallback) {
        const index = this._rosterUpdateCallbacks.indexOf(callback);
        if (index !== -1) {
            this._rosterUpdateCallbacks.splice(index, 1);
        }
    }

    private async initializeMeetingSession(configuration: MeetingSessionConfiguration) {
        const deviceController = new DefaultDeviceController(this._logger);
        this._meetingSession = new DefaultMeetingSession(
            configuration,
            this._logger,
            deviceController,
        );

        const audioVideo = this._meetingSession.audioVideo;

        this._audioVideoManager.audioVideo = audioVideo;

        await this._audioVideoManager.initializeMeetingSession();

        audioVideo.realtimeSubscribeToAttendeeIdPresence((presentAttendeeId, present) => {
            if (!present) {
                delete this._roster[presentAttendeeId];
                this.publishRosterUpdate()();
                return;
            }

            this._audioVideoManager.audioVideo?.realtimeSubscribeToVolumeIndicator(
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

                    if (!this._roster[attendeeId]) {
                        this._roster[attendeeId] = { name: "", role: Role.Attendee } as Attendee;
                    }
                    if (volume !== null) {
                        this._roster[attendeeId].volume = Math.round(volume * 100);
                    }
                    if (muted !== null) {
                        this._roster[attendeeId].muted = muted;
                    }
                    if (signalStrength !== null) {
                        this._roster[attendeeId].signalStrength = Math.round(signalStrength * 100);
                    }

                    if (this._title && attendeeId && !this._roster[attendeeId].name) {
                        const response = await fetch(
                            `${config.CHIME_ROOM_API}/attendee?title=${encodeURIComponent(
                                this._title,
                            )}&attendeeId=${encodeURIComponent(attendeeId)}`,
                        );
                        const json = await response.json();
                        const attendee = this._roster[attendeeId];
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
}
