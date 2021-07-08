import React from 'react';
import {
	DefaultPromisedWebSocketFactory,
	DefaultDOMWebSocketFactory,
	FullJitterBackoff,
	ReconnectingPromisedWebSocket
} from 'amazon-chime-sdk-js';
import ChatLine from "./subcomponents/ChatLine";
import ChatInput from "./subcomponents/ChatInput";
import * as config from '../../config';
import { ChatOpenContext } from "../contexts/ChatOpenContext";

// Types
import { Message } from "./types";

// Styles
import './Chat.css';

const WEB_SOCKET_TIMEOUT_MS = 10000;

type Props = {
	joinInfo: any;
	userName: string;
	title: string;
}

export const Chat: React.FC<Props> = ({ joinInfo, userName, title }) => {

	const [messages, setMessages] = React.useState<Array<Message>>([]);
	const [connection, setConnection] = React.useState<ReconnectingPromisedWebSocket>();

	const chatRef = React.useRef<HTMLInputElement>(null);
	const messagesEndRef = React.useRef<HTMLDivElement>(null);

	const { isOpen } = React.useContext(ChatOpenContext);

	const initChatConnection = async () => {
		const { Meeting, Attendee } = joinInfo;

		const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${Meeting.MeetingId}&AttendeeId=${Attendee.AttendeeId}&JoinToken=${Attendee.JoinToken}`

		const socketConnection = new ReconnectingPromisedWebSocket(
			messagingUrl,
			[],
			'arraybuffer',
			new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
			new FullJitterBackoff(1000, 0, 10000)
		);

		if (config.DEBUG) {
			console.log(socketConnection);
		}

		await socketConnection.open(WEB_SOCKET_TIMEOUT_MS);

		socketConnection.addEventListener('message', event => {
			const data = (event as any).data.split('::');
			const username = data[0];
			const message = data.slice(1).join('::'); // in case the message contains the separator '::'

			const newMessage: Message = {
				timestamp: Date.now(),
				username,
				message
			};

			setMessages(currentMsg => ([...currentMsg, newMessage]));
		});

		setConnection(socketConnection);

		chatRef.current!.focus();
	}

	React.useEffect(() => {
		initChatConnection();
	}, []);

	React.useEffect(() => {
		messagesEndRef.current!.scrollIntoView({ behavior: 'smooth' })
	}, [messages]);

	const handleRoomClick = async (event: any) => {
		event.stopPropagation();
		event.preventDefault();

		const link = `${window.location.origin}${window.location.pathname.replace('meeting', 'index.html')}?action=join&room=${title}`;
		if (config.DEBUG) {
			console.log(link);
		}

		const result = await navigator.permissions.query({ name: "clipboard-write" });

		if (result.state !== "denied") {
			navigator.clipboard.writeText(encodeURI(link));
		}
	}

	return (
		<div className={`chat ${!isOpen ? 'closed' : ''} full-height pos-relative`}>
			<div className="chat__wrapper full-width pos-relative">
				<div className="messages pd-x-1 pos-absolute">
					{messages.map(x => <ChatLine
						messageInfo={x} key={x.timestamp}
						personalUserName={userName} />)}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<ChatInput
				connection={connection}
				inputRef={chatRef}
				userName={userName} />
		</div>
	)
}

export default Chat;
