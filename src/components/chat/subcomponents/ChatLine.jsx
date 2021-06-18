// Framework
import React, { useMemo } from 'react';
import moment from "moment";

// Styles
import "./ChatLine.css";

const urlRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;

export const ChatLine = ({ messageInfo: { message, timestamp, username } }) => {

	const parsedMessage = useMemo(() => message.replace(urlRegExp, (match) => {
		const formattedMatch = match;

		if (!match.startsWith("http")) {
			formattedMatch = `http://${match}`;
		}

		return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
	}));

	return (
		<div className="chat-line">
			<div className="chat-line_leftsection">
				<span className="username">
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

export default ChatLine;