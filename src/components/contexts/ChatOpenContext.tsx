// Framework
import React, { createContext, useState } from "react";

type Context = {
	isOpen: boolean;
	set: React.Dispatch<boolean>;
}

export const ChatOpenContext = createContext<Context>({
	isOpen: false,
	set: _ => void 0,
});

export const ChatOpenContextProvider: React.FC = ({ children }) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<ChatOpenContext.Provider value={{
			isOpen,
			set: setIsOpen,
		}}>
			{children}
		</ChatOpenContext.Provider>
	)
}

export default ChatOpenContextProvider;