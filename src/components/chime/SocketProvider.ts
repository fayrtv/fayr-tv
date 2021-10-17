// Framework
import { ReconnectingPromisedWebSocket } from "amazon-chime-sdk-js";

// Types
import { ISocketProvider, SocketEventType, SocketMessage } from './types';

type ListenerCallback = (event: AwsWebsocketMessage) => Promise<void>;

type RawAwsWebsocketMessage = {
	eventType: string;
	data: string;
}

type AwsWebsocketMessage = {
	eventType: SocketEventType;
	data: string;
}

export class SocketProvider implements ISocketProvider {

	private _socket: ReconnectingPromisedWebSocket;

	private _listeners: Map<SocketEventType, Array<ListenerCallback>>;

	public constructor(
		socket: ReconnectingPromisedWebSocket) {
		this._socket = socket;
		this._listeners = new Map<SocketEventType, Array<ListenerCallback>>();

		socket.addEventListener("message", this.onSendMessage)
	}

	private onSendMessage = (payload: any) => {
		const rawAwsSocketMessage = JSON.parse(payload.data) as RawAwsWebsocketMessage;
		
		const awsSocketMessage: AwsWebsocketMessage = {
			eventType: +rawAwsSocketMessage.eventType,
			data: rawAwsSocketMessage.data,
		}

		const { eventType, data } = awsSocketMessage;

		const listeners = this._listeners.get(eventType);

		if (!listeners) {
			return;
		}

		for (const listener of listeners) {
			listener(awsSocketMessage);
		}
	}

	send<T>(message: SocketMessage<T>) {
		const websocketCompatibleMessage: RawAwsWebsocketMessage = {
			eventType: message.messageType.toString(),
			// This is kind of stupid, but without a second stringify for escaping quotes, aws will not understand this
			data: JSON.stringify(JSON.stringify(message.payload))
		}

		const data = `{
			"message": "sendmessage",
			"data": ${JSON.stringify(JSON.stringify(websocketCompatibleMessage))}
		}`;

		try {
			this._socket.send(data);
		} catch (error) {
			console.error(error);
		}
	}

	addListener<T>(eventType: SocketEventType, callback: (payload: T) => Promise<void>): () => void {
		let eventListeners = this._listeners.get(eventType);

		if (!eventListeners) {
			eventListeners = new Array<ListenerCallback>();
			this._listeners.set(eventType, eventListeners);
		}

		const typedCallback = async (event: AwsWebsocketMessage) => {
			// Parse back the actual message
			const parsedPayload: T = JSON.parse(JSON.parse(event.data));

			await callback(parsedPayload);
		}

		eventListeners.push(typedCallback);

		return () => this.removeListener(eventType, typedCallback);
	}

	close(timeoutMs: number, code?: number | undefined, reason?: string | undefined) {
		this._socket.close(timeoutMs, code, reason);
	}

	private removeListener(eventType: SocketEventType, callback: ListenerCallback): void {				
		let eventListeners = this._listeners.get(eventType);
		
		if (!eventListeners || eventListeners?.length === 0) {
			return;
		}

		eventListeners.splice(eventListeners.indexOf(callback), 1);
	}

}

export default SocketProvider;