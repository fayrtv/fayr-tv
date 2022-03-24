import { Attendee } from "components/chime/ChimeSdkWrapper";

export type Roster = Array<Attendee>;

export type LocalVideoInfo = {
    tile: number;
    node: React.ReactNode;
    replace: boolean;
};

export enum ActivityState {
    Available,
    AwayFromKeyboard,
}

export type ActivityStateChangeDto = {
    attendeeId: string;
    activityState: ActivityState;
};
