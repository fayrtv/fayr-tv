// Framework
import * as React from "react";
import { withoutPropagation } from "util/mouseUtils";

import Emoji from "components/common/Emoji";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

// Styles
import styles from "./ReactionButton.module.scss";

import ReactionButtonSelection, { ReactionsDisabledIcon } from "./ReactionButtonSelection";

export const ReactionButton = () => {
    const [reactionsOpen, setReactionsOpen] = React.useState(false);
    const { selectedEmojiReaction, reactionsDisabled } = React.useContext(SelectedReactionContext);

    const reactionButtonOnClick = () => {
        setReactionsOpen((open) => !open);
    };

    return (
        <div
            key="ReactionButton"
            className={`${styles.Button} ${styles.ReactionButton} btn rounded`}
            onClick={withoutPropagation(reactionButtonOnClick)}
        >
            {reactionsDisabled ? (
                <ReactionsDisabledIcon color="#D2D2D2" />
            ) : (
                <Emoji text={selectedEmojiReaction} />
            )}
            {reactionsOpen && (
                <div className={styles.ReactionRow}>
                    <ReactionButtonSelection onClose={() => setReactionsOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default ReactionButton;
