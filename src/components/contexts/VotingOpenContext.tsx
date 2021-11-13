// Framework
import React, { createContext, useState } from "react";

type Context = {
    isOpen: boolean;
    set: React.Dispatch<boolean>;
};

export const VotingOpenContext = createContext<Context>({
    isOpen: false,
    set: (_) => void 0,
});

export const VotingOpenContextProvider: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <VotingOpenContext.Provider
            value={{
                isOpen,
                set: setIsOpen,
            }}
        >
            {children}
        </VotingOpenContext.Provider>
    );
};

export default VotingOpenContextProvider;
