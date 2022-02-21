export interface ISocketProvider {
    addListener<T>(eventType: SocketEventType, callback: (payload: T) => Promise<void>): () => void;
    send<T>(message: SocketMessage<T>): void;
    close(timeoutMs: number, code?: number | undefined, reason?: string | undefined): void;
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
}
