export type Message = {
    timestamp: number;
    username: string;
    message: string;
    seen: boolean;
};

export type MessageTransferObject = {
    username: string;
    message: string;
};
