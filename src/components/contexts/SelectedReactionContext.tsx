// Framework
import React, { createContext } from "react";

type Context = {
	selectedEmoji: string;
	setSelectedEmoji: React.Dispatch<string>;
}

const defaultValues = {
	selectedEmoji: "<3",
	setSelectedEmoji: (_: string) => void 0,
};

export const SelectedReactionContext = createContext<Context>(defaultValues);

export const SelectedReactionContextProvider: React.FC = ({ children }) => {

	const [selectedEmoji, setSelectedEmoji] = React.useState<string>(defaultValues.selectedEmoji);

	return (
		<SelectedReactionContext.Provider value={{
			selectedEmoji,
			setSelectedEmoji,
		}}>
			{children}
		</SelectedReactionContext.Provider>
	)
}

export default SelectedReactionContextProvider;