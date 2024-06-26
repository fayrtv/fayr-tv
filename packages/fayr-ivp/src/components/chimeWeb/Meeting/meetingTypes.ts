import { RoomMemberRole } from "types/Room";

import { DeviceInfo } from "components/chime/AudioVideoManager";
import { JoinInfo } from "components/chimeWeb/types";

export type MeetingStatus = "Loading" | "Success" | "Failed";

export type MeetingInputOutputDevices = {
    cam?: DeviceInfo;
    audioInput?: DeviceInfo;
    audioOutput?: DeviceInfo;
};

export type MeetingMetaData = {
    userName: string;
    title: string;
    role: RoomMemberRole;
    joinInfo?: JoinInfo;
    playbackURL: string;
    meetingInputOutputDevices?: MeetingInputOutputDevices;

    muted: boolean;
    forceMuted: boolean;
    videoEnabled: boolean;
    forceVideoDisabled: boolean;
};
