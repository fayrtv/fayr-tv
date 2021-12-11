// Framework
import React, { createContext } from "react";

type Context = {
    selectedEmojiReaction: string;
    setSelectedEmojiReaction: React.Dispatch<string>;
    reactionsDisabled: boolean;
    setReactionsDisabled: (_: boolean) => void;
};

const defaultValues = {
    selectedEmojiReaction: "<3",
    setSelectedEmojiReaction: (_: string) => void 0,
    reactionsDisabled: false,
    setReactionsDisabled: (_: boolean) => void 0,
};

export const SelectedReactionContext = createContext<Context>(defaultValues);

export const SelectedReactionContextProvider: React.FC = ({ children }) => {
    const [reactionsDisabled, setReactionsDisabled] = React.useState<boolean>(
        defaultValues.reactionsDisabled,
    );
    const [selectedEmoji, setSelectedEmoji] = React.useState<string>(
        defaultValues.selectedEmojiReaction,
    );

    return (
        <SelectedReactionContext.Provider
            value={{
                selectedEmojiReaction: selectedEmoji,
                setSelectedEmojiReaction: (emoji: string) => {
                    setReactionsDisabled(false);
                    setSelectedEmoji(emoji);
                },
                reactionsDisabled,
                setReactionsDisabled: (value: boolean) => {
                    setReactionsDisabled(value);
                },
            }}
        >
            {children}
        </SelectedReactionContext.Provider>
    );
};

export default SelectedReactionContextProvider;
