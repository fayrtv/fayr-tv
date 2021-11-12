// Framework
import * as React from "react";

// Components
import Flex from "../../common/Flex";
import Emoji from "react-emoji-render";

// Functionality
import useGlobalClickHandler from "hooks/useGlobalClickHandler";

// Types
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

// Styles
import styles from "./styles/ReactionButtonSelection.module.scss";
import { isInRect } from "util/coordinateUtil";

const emojis = [":smile:", ":heart:", ":clap:", ":tada:", ":joy:"];

type Props = {
	onClose(): void;
}

export const ReactionButtonSelection = ({ onClose }: Props) => {

	const buttonContainerRef = React.useRef<HTMLDivElement>(null);
	const { setSelectedEmoji } = React.useContext(SelectedReactionContext);

	const onEmojiClick = (emoji: string) => {
		setSelectedEmoji(emoji);
	}
	
	useGlobalClickHandler(clickEvent => {	
		if (!isInRect(buttonContainerRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)) {
			onClose();
		}
	}, [ onClose ]);

	return (
		<Flex
			className={styles.ReactionButtonContainer}
			direction="Column"
			ref={buttonContainerRef}>
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