import { JoinInfo } from "components/chimeWeb/types";

export type MeetingStatus = "Loading" | "Success" | "Failed";

export type SSData = {
    username: string;
    title: string;
    role: string;
    joinInfo?: JoinInfo;
    playbackURL: string;
};
