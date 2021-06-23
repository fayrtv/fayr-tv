import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

// Styles
import './Chat.css';

class Chat extends Component {

	constructor() {
		super();

		this.WEB_SOCKET_TIMEOUT_MS = 10000;

		this.state = {
			messages: [],
			connection: null,
			showPopup: false
		}
		this.chatRef = React.createRef();
		this.messagesEndRef = React.createRef();
	}

	componentDidMount() {
		this.initChatConnection();
	}

	async initChatConnection() {
		const { Meeting, Attendee } = this.props.joinInfo;
		const messagingUrl = `${config.CHAT_WEBSOCKET}?MeetingId=${Meeting.MeetingId}&AttendeeId=${Attendee.AttendeeId}&JoinToken=${Attendee.JoinToken}`
		const connection = new ReconnectingPromisedWebSocket(
			messagingUrl,
			[],
			'arraybuffer',
			new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
			new FullJitterBackoff(1000, 0, 10000)
		);

		if (config.DEBUG) console.log(connection);

		await connection.open(this.WEB_SOCKET_TIMEOUT_MS);

		connection.addEventListener('message', event => {
			const messages = this.state.messages;
			const data = event.data.split('::');
			const username = data[0];
			const message = data.slice(1).join('::'); // in case the message contains the separator '::'

			messages.push({
				timestamp: Date.now(),
				username,
				message
			});

			this.setState({ messages });
		});

		this.setState({ connection });

		this.chatRef.current.focus();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom = () => {
		this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	handleRoomClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const { title } = this.props;
		const link = `${window.location.origin}${window.location.pathname.replace('meeting', 'index.html')}?action=join&room=${title}`;
		if (config.DEBUG) console.log(link);
		this.copyTextToClipboard(encodeURI(link));
	}

	render() {
		const { connection, messages } = this.state;
		const { username } = this.props;
		// const popup = showPopup ? 'show' : '';
		return (
			<ChatOpenContext.Consumer>
				{({ isOpen }) => (
					<div className={`chat ${!isOpen ? 'closed' : ''} full-height pos-relative`}>
						<div className="chat__wrapper full-width pos-relative">
							<div className="messages pd-x-1 pos-absolute">
								{messages.map(x => <ChatLine
									messageInfo={x} key={x.timestamp}
									personalUserName={username} />)}
								<div ref={this.messagesEndRef} />
							</div>
						</div>
						<ChatInput
							connection={connection}
							inputRef={this.chatRef}
							username={username} />
					</div>
				)}
			</ChatOpenContext.Consumer>
		)
	}
}

Chat.propTypes = {
	chime: PropTypes.object,
	title: PropTypes.string,
	username: PropTypes.string,
	joinInfo: PropTypes.object
};

export default Chat;
