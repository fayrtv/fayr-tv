import * as React from "react";
import styled from "styled-components";
import { isInRect } from "util/coordinateUtil";

import useGlobalClickHandler from "hooks/useGlobalClickHandler";

import styles from "components/chimeWeb/Controls/styles/ReactionButtonSelection.module.scss";
import Emoji from "components/common/Emoji";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

import { MaterialIcon } from "@fayr/common";
import { Flex } from "@fayr/common";

const emojis = [":smile:", ":heart:", ":clap:", ":tada:", ":joy:"];

type Props = {
    onClose(): void;
};

const VerticalDivider = styled.div`
    display: block;
    border-left: 0 solid gray;
    margin: 0 10px;
    align-self: stretch;
    :after {
        content: "";
        display: block;
        margin-left: 0;
        width: 1px;
        height: 100%;
        box-shadow: 0 0 5px gray;
    }
`;

export const ReactionsDisabledIcon = (
    props: Omit<React.ComponentProps<typeof MaterialIcon>, "iconName">,
) => <MaterialIcon iconName="visibility_off" {...props} />;

export const ReactionButtonSelection = ({ onClose }: Props) => {
    const buttonContainerRef = React.useRef<HTMLDivElement>(null);
    const { setSelectedEmojiReaction, setReactionsDisabled } =
        React.useContext(SelectedReactionContext);

    useGlobalClickHandler(
        (clickEvent) => {
            if (
                !isInRect(
                    buttonContainerRef.current!.getBoundingClientRect(),
                    clickEvent.x,
                    clickEvent.y,
                )
            ) {
                onClose();
            }
        },
        [onClose],
    );

    return (
        <Flex
            className={styles.ReactionButtonContainer}
            direction="Column"
            ref={buttonContainerRef}
        >
            {/* <span className={styles.ReactionButtonInfo}>
				Tippe auf den Bildschirm, um eine Reaktion zu senden
			</span> */}
            <Flex
                className={styles.ReactionButtonSelection}
                crossAlign="Center"
                mainAlign="Center"
                direction="Row"
                style={{ alignItems: "center" }}
            >
                {emojis.map((emoji) => (
                    <div onClick={() => setSelectedEmojiReaction(emoji)} key={emoji}>
                        <Emoji text={emoji} />
                    </div>
                ))}
                <VerticalDivider />
                <span style={{ marginLeft: 2, marginRight: 10, display: "inherit" }}>
                    <ReactionsDisabledIcon
                        onClick={() => setReactionsDisabled(true)}
                        color="#D2D2D2"
                        size="1.75em"
                    />
                </span>
            </Flex>
        </Flex>
    );
};

export default ReactionButtonSelection;
