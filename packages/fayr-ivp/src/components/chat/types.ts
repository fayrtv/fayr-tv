export type Message = {
    id: string;
    timestamp: number;
    username: string;
    message: string;
    seen: boolean;
};

export type MessageTransferObject = {
    id: string;
    username: string;
    message: string;
};
