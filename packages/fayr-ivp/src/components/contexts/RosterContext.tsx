// Framework
import React from "react";

type Context = {
    previousRoster: React.MutableRefObject<any>;
    roster: Array<any>;
    setRoster: (roster: Array<any>) => void;
};

export const RosterContext = React.createContext<Context>({
    previousRoster: undefined as unknown as React.MutableRefObject<any>,
    roster: [],
    setRoster: (_) => void 0,
});

export const RosterContextProvider: React.FC = ({ children }) => {
    const previousRoster = React.useRef<any>({});
    const [roster, setRoster] = React.useState<Array<any>>([]);

    return (
        <RosterContext.Provider
            value={{
                previousRoster,
                roster,
                setRoster,
            }}
        >
            {children}
        </RosterContext.Provider>
    );
};

export default RosterContextProvider;
