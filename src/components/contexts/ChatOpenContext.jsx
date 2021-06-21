// Framework
import React, { createContext, useState } from "react";

export const ChatOpenContext = createContext();

export const ChatOpenContextProvider = ({ children }) => {

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