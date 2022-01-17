import { DeviceInfo } from "components/chime/ChimeSdkWrapper";
import { JoinInfo } from "components/chimeWeb/types";

export type MeetingStatus = "Loading" | "Success" | "Failed";

export type MeetingInputOutputDevices = {
    cam?: DeviceInfo;
    audioInput?: DeviceInfo;
    audioOutput?: DeviceInfo;
};

export type MeetingMetaData = {
    username: string;
    title: string;
    role: string;
    joinInfo?: JoinInfo;
    playbackURL: string;
    meetingInputOutputDevices?: MeetingInputOutputDevices;
};
