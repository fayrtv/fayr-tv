import { DefaultWebSocketAdapter, Logger, WebSocketAdapter } from "amazon-chime-sdk-js";
import * as config from "config";
import { inject, injectable } from "inversify";
import { Nullable } from "types/global";
import Types from "types/inject";

import LogProvider from "./LogProvider";
import IChimeEvents from "./interfaces/IChimeEvents";
import IRoomManager from "./interfaces/IRoomManager";
import { ISocketProvider, SocketEventType, SocketMessage } from "./types";

type ListenerCallback = (event: AwsWebsocketMessage) => Promise<void>;

type RawAwsWebsocketMessage = {
    eventType: string;
    data: string;
};

type AwsWebsocketMessage = {
    eventType: SocketEventType;
    data: string;
};

@injectable()
export class SocketProvider implements ISocketProvider {
    private _socket: Nullable<WebSocketAdapter> = null;

    private _listeners: Map<SocketEventType, Array<ListenerCallback>>;

    private _roomManager: IRoomManager;

    private _logger: Logger;

    public constructor(
        @inject(Types.IRoomManager) roomManager: IRoomManager,
        @inject(Types.LogProvider) logProvider: LogProvider,
        @inject(Types.IChimeEvents) chimeEvents: IChimeEvents,
    ) {
        this._listeners = new Map<SocketEventType, Array<ListenerCallback>>();
        this._roomManager = roomManager;
        this._logger = logProvider.logger;

        chimeEvents.roomLeft.register(
            (() => {
                this._socket = null;
            }).bind(this),
        );
    }

    send<T>(message: SocketMessage<T>) {
        const websocketCompatibleMessage: RawAwsWebsocketMessage = {
            eventType: message.messageType.toString(),
            // This is kind of stupid, but without a second stringify for escaping quotes, aws will not understand this
            data: JSON.stringify(JSON.stringify(message.payload)),
        };

        const data = `{
			"message": "sendmessage",
			"data": ${JSON.stringify(JSON.stringify(websocketCompatibleMessage))}
		}`;

        try {
            this._socket!.send(data);
        } catch (error) {
            console.error(error);
        }
    }

    addListener<T>(
        eventType: SocketEventType,
        callback: (payload: T) => Promise<void>,
    ): () => void {
        let eventListeners = this._listeners.get(eventType);

        if (!eventListeners) {
            eventListeners = new Array<ListenerCallback>();
            this._listeners.set(eventType, eventListeners);
        }

        const typedCallback = async (event: AwsWebsocketMessage) => {
            // Parse back the actual message
            const parsedPayload: T = JSON.parse(JSON.parse(event.data));

            await callback(parsedPayload);
        };

        eventListeners.push(typedCallback);

        return () => this.removeListener(eventType, typedCallback);
    }

    close(code?: number | undefined, reason?: string | undefined) {
        this._socket?.close(code, reason);
    }

    joinRoomSocket(): Nullable<WebSocketAdapter> {
        if (!this._roomManager.configuration) {
            this._logger.error("configuration does not exist");
            return null;
        }

        const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${
            this._roomManager.configuration.meetingId
        }&AttendeeId=${this._roomManager.configuration.credentials!.attendeeId}&JoinToken=${
            this._roomManager.configuration.credentials!.joinToken
        }`;

        this._socket = new DefaultWebSocketAdapter(this._logger);
        this._socket.create(messagingUrl, []);

        if (config.DEBUG) {
            console.log(this._socket);
        }
        this._socket.addEventListener("message", this.onSendMessage);
        return this._socket;
    }

    private onSendMessage = (payload: any) => {
        const rawAwsSocketMessage = JSON.parse(payload.data) as RawAwsWebsocketMessage;

        const awsSocketMessage: AwsWebsocketMessage = {
            eventType: +rawAwsSocketMessage.eventType,
            data: rawAwsSocketMessage.data,
        };

        const { eventType } = awsSocketMessage;

        const listeners = this._listeners.get(eventType);

        if (!listeners) {
            return;
        }

        for (const listener of listeners) {
            listener(awsSocketMessage);
        }
    };

    private removeListener(eventType: SocketEventType, callback: ListenerCallback): void {
        let eventListeners = this._listeners.get(eventType);

        if (!eventListeners || eventListeners?.length === 0) {
            return;
        }

        eventListeners.splice(eventListeners.indexOf(callback), 1);
    }
}

export default SocketProvider;
