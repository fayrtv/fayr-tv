// Framework
import React, { createContext, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Context = {
    isOpen: boolean;
    set: React.Dispatch<boolean>;
};

export const ChatOpenContext = createContext<Context>({
    isOpen: false,
    set: (_) => void 0,
});

export const ChatOpenContextProvider: React.FC = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 961 });

    const [isOpen, setIsOpen] = useState(isDesktop);

    return (
        <ChatOpenContext.Provider
            value={{
                isOpen,
                set: setIsOpen,
            }}
        >
            {children}
        </ChatOpenContext.Provider>
    );
};

export default ChatOpenContextProvider;
