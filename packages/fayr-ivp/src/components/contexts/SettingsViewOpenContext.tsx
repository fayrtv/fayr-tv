// Framework
import React, { createContext, useState } from "react";

type Context = {
    isOpen: boolean;
    set: React.Dispatch<boolean>;
};

export const SettingsViewOpenContext = createContext<Context>({
    isOpen: false,
    set: (_) => void 0,
});

export const SettingsViewOpenContextProvider: React.FC = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SettingsViewOpenContext.Provider
            value={{
                isOpen,
                set: setIsOpen,
            }}
        >
            {children}
        </SettingsViewOpenContext.Provider>
    );
};

export default SettingsViewOpenContextProvider;
