import React from "react";

import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/interfaces/ISocketProvider";
import { EmojiReactionTransferObject } from "components/chimeWeb/types";

export type EmojiReaction = { emoji: string; relativeXClick: number; relativeYClick: number };

export const useEmojiReactions = (
    attendeeId: string,
    renderReactionElement: (reaction: EmojiReaction) => JSX.Element,
    reactionsDisabled: boolean = false,
) => {
    const { socket, sendWhenReady } = useSocket();
    const [reactionElements, setReactionElements] = React.useState<Array<React.ReactNode>>([]);

    const [unreceivedReactions, setUnreceivedReactions] = React.useState<EmojiReaction[]>([]);

    const publishReaction = React.useCallback(
        (reaction: EmojiReaction) => {
            setUnreceivedReactions((curr) => [...curr, reaction]);
            sendWhenReady({
                messageType: SocketEventType.EmojiReaction,
                payload: {
                    attendeeId,
                    emoji: reaction.emoji,
                    clickPosition: {
                        relativeX: reaction.relativeXClick,
                        relativeY: reaction.relativeYClick,
                    },
                },
            });
        },
        [attendeeId, sendWhenReady],
    );

    const removeReactionEmojiAfterDelay = (reaction: JSX.Element) =>
        setTimeout(
            () => setReactionElements((reactions) => reactions.filter((x) => x !== reaction)),
            2000,
        );

    const pushReaction = React.useCallback(
        (reaction: EmojiReaction) => {
            setReactionElements((currentReactions) => {
                const newReaction = renderReactionElement(reaction);
                const newReactions = [...currentReactions, newReaction];

                removeReactionEmojiAfterDelay(newReaction);

                return newReactions;
            });
        },
        [renderReactionElement],
    );

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<EmojiReactionTransferObject>(
            SocketEventType.EmojiReaction,
            ({ emoji, clickPosition }) => {
                const { relativeX, relativeY } = clickPosition!;

                const emojiReaction: EmojiReaction = {
                    emoji,
                    relativeXClick: relativeX,
                    relativeYClick: relativeY,
                };

                // Remove from unreceived reactionElements
                setUnreceivedReactions((curr) =>
                    curr.filter((x) => !reactionsEqual(x, emojiReaction)),
                );

                pushReaction(emojiReaction);

                return Promise.resolve();
            },
        );
    }, [pushReaction, socket, unreceivedReactions]);

    const addEmojiReaction = (reaction: EmojiReaction) => {
        publishReaction(reaction);
        pushReaction(reaction);
    };

    React.useEffect(() => {
        if (reactionsDisabled) {
            setReactionElements([]);
        }
    }, [reactionsDisabled]);

    return { reactionElements: reactionElements, addEmojiReaction };
};

const reactionsEqual = (x: EmojiReaction, y: EmojiReaction) => {
    return (
        x.emoji === y.emoji &&
        x.relativeXClick === y.relativeXClick &&
        x.relativeYClick === y.relativeYClick
    );
};
