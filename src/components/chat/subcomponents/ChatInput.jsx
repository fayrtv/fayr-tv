// Framework
import React, { useState } from "react";

import "./ChatInput.css"

export const ChatInput = ({ connection, inputRef, username }) => {

	const [message, setMessage] = useState("");

	const sendMessage = () => {
		if (message) {
			const data = `{
				"message": "sendmessage",
				"data": "${username}::${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
			}`;

			connection.send(data);

			setMessage("");
		}
	}

	const onKeyDown = event => {
		if (event.keyCode !== 13) { // keyCode 13 is carriage return
			return;
		}

		sendMessage();
	}

	const onInput = event => setMessage(event.target.value);

	return (
		<div className="composer chime-web-composer full-width chat-input">
			<input
				ref={inputRef}
				type="text"
				placeholder="Hier tippen ..."
				value={message}
				maxLength={510}
				onChange={onInput}
				onKeyDown={onKeyDown}
			/>
			<button
				className="btn btn--primary"
				onClick={sendMessage}>
				Senden
			</button>
		</div>
	);
}

export default ChatInput;