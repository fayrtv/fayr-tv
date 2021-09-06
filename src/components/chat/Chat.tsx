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
import { connect } from 'react-redux';
import { ReduxStore } from '../../redux/store';
import { Action, Dispatch } from 'redux';

// Functionality
import { addMessage, markAsSeen } from "redux/reducers/chatMessageReducer";
import { CouldBeArray } from '../../util/collectionUtil';

// Types
import { Message } from "./types";

// Styles
import './Chat.scss';

const WEB_SOCKET_TIMEOUT_MS = 10000;

type Props = {
	joinInfo: any;
	userName: string;
	title: string;
}

type ReduxProps = {
	messages: Array<Message>;
}

type ReduxDispatches = {
	addMessages(messages: CouldBeArray<Message>): void;
	markAsSeen(messages: CouldBeArray<Message>): void;
}

export const Chat: React.FC<Props & ReduxProps & ReduxDispatches> = ({ joinInfo, userName, title, messages, addMessages, markAsSeen }) => {

	const [connection, setConnection] = React.useState<ReconnectingPromisedWebSocket>();

	const chatRef = React.useRef<HTMLInputElement>(null);
	const messageRef = React.useRef<HTMLDivElement>(null);

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
				message,
				seen: false,
			};

			addMessages(newMessage);
		});

		setConnection(socketConnection);

		chatRef.current!.focus();
	}

	React.useEffect(() => {
		initChatConnection();
	}, []);

	React.useEffect(() => {

		if (!isOpen) {
			return;
		}

		const ref = messageRef.current;

		if (ref && (ref.scrollTop + ref.clientHeight < ref.scrollHeight)) {
			messageRef.current!.scrollTo({ top: ref.scrollHeight, behavior: "smooth" });
		}
	}, [isOpen, messages]);

	React.useEffect(() => {
		if (isOpen) {
			const unseenMessages = messages.filter(x => !x.seen);
			if (unseenMessages.length > 0) {
				markAsSeen(unseenMessages);
			}
		}
	}, [messages, isOpen, markAsSeen]);

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
		<div className={`Chat ${!isOpen ? 'Closed' : ''}`}>
			<div className="ChatWrapper pos-relative">
				<div
					className="Messages pd-x-1"
					ref={messageRef}>
					{messages.map(x => <ChatLine
						messageInfo={x} key={x.timestamp}
						personalUserName={userName} />)}
				</div>
			</div>
			<ChatInput
				connection={connection}
				inputRef={chatRef}
				userName={userName} />
		</div>
	)
}

const mapStateToProps = (state: ReduxStore): ReduxProps => ({
	messages: state.chatMessageReducer,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ReduxDispatches => ({
	addMessages: (messages: CouldBeArray<Message>) => dispatch(addMessage(messages)),
	markAsSeen: (messages: CouldBeArray<Message>) => dispatch(markAsSeen(messages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
