import { ActivityState } from "components/chimeWeb/Cams/types";

export enum Role {
    Attendee,
    Host,
}

export type Attendee = {
    attendeeId: string;
    muted: boolean;
    forceMuted: boolean;
    name: string;
    signalStrength: number;
    tileId: number;
    videoEnabled: boolean;
    forceVideoDisabled: boolean;
    videoElement: React.RefObject<HTMLVideoElement>;
    volume: number;
    role: Role;
    activityState: ActivityState;
};
