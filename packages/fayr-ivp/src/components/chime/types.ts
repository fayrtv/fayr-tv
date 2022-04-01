import { WebSocketAdapter } from "amazon-chime-sdk-js";
import { Nullable } from "types/global";

import { ActivityState } from "components/chimeWeb/Cams/types";

export interface ISocketProvider {
    addListener<T>(eventType: SocketEventType, callback: (payload: T) => Promise<void>): () => void;
    send<T>(message: SocketMessage<T>): void;
    close(code?: number | undefined, reason?: string | undefined): void;
    joinRoomSocket(): Nullable<WebSocketAdapter>;
}

export type SocketMessage<T = string> = {
    messageType: SocketEventType;
    payload: T;
};

export enum SocketEventType {
    Unspecified = 0,
    ChatMessage = 1,
    EmojiReaction = 2,
    AttendeeVote = 3,
    ForceAttendeeMicChange = 4,
    ForceAttendeeVideoChange = 5,
    TimeStampHeartBeat = 6,
    ActivityStateChange = 7,
}

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
