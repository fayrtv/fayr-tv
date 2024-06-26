import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { Callback, Nullable } from "types/global";

import { JoinInfo } from "../../chimeWeb/types";
import { AttendeeRosterCallback } from "../RoomManager";
import { Attendee } from "../types";

export type RosterUpdateCallback = Callback<RosterMap>;

export type RosterMap = {
    [key: string]: Attendee;
};

export default interface IRoomManager {
    configuration: MeetingSessionConfiguration;
    attendeeId: Nullable<string>;
    roster: RosterMap;

    registerAttendeeRosterCallback(cb: AttendeeRosterCallback): void;
    publishAttendeeRoster(): void;
    unRegisterAttendeeRosterCallback(cb: AttendeeRosterCallback): void;

    subscribeToRosterUpdate(callback: RosterUpdateCallback): void;
    unsubscribeFromRosterUpdate(callback: RosterUpdateCallback): void;
    reInitializeMeetingSession(joinInfo: JoinInfo, name: string): Promise<void>;
    publishUpdate(): void;

    joinRoom(element: HTMLAudioElement): Promise<void>;
    createRoom: (
        role: string,
        name: string,
        title: string,
        playbackURL?: string,
        region?: string,
    ) => Promise<JoinInfo>;
    leaveRoom(end: boolean): Promise<void>;
}
