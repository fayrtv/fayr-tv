import { PlatformType } from "platform-config/platform-type/PlatformType";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

type Context = {
    type?: PlatformType;
    setType: Dispatch<SetStateAction<PlatformType | undefined>>;
};

const defaults = {
    type: undefined,
    setType: () => void 0,
};

export const PlatformConfiguratorContext = createContext<Context>(defaults);

export const PlatformConfiguratorContextProvider: React.FC = ({ children }) => {
    const [type, setType] = useState<PlatformType | undefined>(defaults.type);

    return (
        <PlatformConfiguratorContext.Provider
            value={{
                type,
                setType,
            }}
        >
            {children}
        </PlatformConfiguratorContext.Provider>
    );
};

export default PlatformConfiguratorContextProvider;
