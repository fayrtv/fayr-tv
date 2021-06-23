// Framework
import React, { useMemo } from 'react';
import moment from "moment";
import PropTypes from 'prop-types';

// Styles
import "./ChatLine.css";

const urlRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;

export const ChatLine = ({ personalUserName, messageInfo: { message, timestamp, username } }) => {

	const parsedMessage = useMemo(() => message.replace(urlRegExp, (match) => {
		let formattedMatch = match;

		if (!match.startsWith("http")) {
			formattedMatch = `http://${match}`;
		}

		return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
	}), [message]);

	const sentBySelf = personalUserName === username;

	return (
		<div className={`chat-line ${sentBySelf ? "outgoing_chat" : "incoming_chat"}`}>
			<div className="chat-line_leftsection">
				<span className={`username ${sentBySelf ? "self" : "other"}`}>
					{username}
				</span>
				<span dangerouslySetInnerHTML={{ __html: parsedMessage }} />
			</div>
			<span className="chat-line_timestamp">
				{moment(timestamp).format('HH:MM')}
			</span>
		</div>
	)
}

ChatLine.propTypes = {
	personalUserName: PropTypes.string,
	messageInfo: PropTypes.object,
};

export default ChatLine;