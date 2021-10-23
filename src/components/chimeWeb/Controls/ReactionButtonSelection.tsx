// Framework
import * as React from "react";

// Components
import Flex from "../../common/Flex";

// Styles
import styles from "./styles/ReactionButtonSelection.module.scss";
import Emoji from "react-emoji-render";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

const emojis = [":smile:", ":heart:", ":clap:", ":tada:", ":joy:"];

export const ReactionButtonSelection = () => {
	const { setSelectedEmoji } = React.useContext(SelectedReactionContext);

	const onEmojiClick = (emoji: string) => {
		setSelectedEmoji(emoji);
	}

	return (
		<Flex
			className={styles.ReactionButtonContainer}
			direction="Column">
			{/* <span className={styles.ReactionButtonInfo}>
				Tippe auf den Bildschirm, um eine Reaktion zu senden
			</span> */}
			<Flex 
				className={styles.ReactionButtonSelection}
				crossAlign="Center"
				mainAlign="Center"
				direction="Row">
				{ emojis.map(emoji => (
					<div
						onClick={() => onEmojiClick(emoji)}
						key={emoji}>
						<Emoji text={emoji}/>
					</div>
				))}
			</Flex>
		</Flex>
	);
}

export default ReactionButtonSelection;