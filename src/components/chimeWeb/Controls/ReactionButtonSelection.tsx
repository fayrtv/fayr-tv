// Framework
import * as React from "react";

// Components
import Flex from "../../common/Flex";

// Styles
import styles from "./styles/ReactionButtonSelection.module.scss";
import Emoji from "react-emoji-render";
import useSocket from "hooks/useSocket";
import { SocketEventType } from '../../chime/types';
import { EmojiReactionTransferObject } from "../types";

const emojis = [":smile:", ":heart:", ":clap:", ":tada:"];

type Props = {
	attendeeId: string;
}

export const ReactionButtonSelection = ({ attendeeId }: Props) => {

	const { socket } = useSocket();

	const onEmojiClick = (emoji: string) => {
		console.log(emoji);

		socket?.send<EmojiReactionTransferObject>({
			messageType: SocketEventType.EmojiReaction,
			payload: {
				attendeeId,
				emoji,
			},
		});
	}

	return (
		<Flex 
			className={styles.ReactionButtonSelection}
			crossAlign="Center"
			direction="Row">
			{ emojis.map(emoji => (
				<div
					onClick={() => onEmojiClick(emoji)}
					key={emoji}>
					<Emoji text={emoji}/>
				</div>
			))}
		</Flex>
	);
}

export default ReactionButtonSelection;