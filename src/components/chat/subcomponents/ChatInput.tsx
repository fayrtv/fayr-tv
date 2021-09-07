// Framework
import React, { useState } from "react";
import { ReconnectingPromisedWebSocket } from 'amazon-chime-sdk-js';

import "./ChatInput.scss"

type Props = {
	connection: ReconnectingPromisedWebSocket | undefined;
	inputRef: React.RefObject<HTMLInputElement>;
	userName: string;
}

export const ChatInput = ({ connection, inputRef, userName }: Props) => {

	const [message, setMessage] = useState("");

	const sendMessage = () => {
		if (message) {
			const data = `{
				"message": "sendmessage",
				"data": "${userName}::${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
			}`;

			connection!.send(data);

			setMessage("");
		}
	}

	const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
		if (event.keyCode !== 13) { // keyCode 13 is carriage return
			return;
		}

		sendMessage();
	}

	const onInput: React.ChangeEventHandler<HTMLInputElement> = event => setMessage(event.target.value);

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
				disabled={!connection}
				className="btn btn--primary"
				onClick={sendMessage}>
				Senden
			</button>
		</div>
	);
}

export default ChatInput;