import React, { Dispatch, SetStateAction } from "react";
import { isFalsyOrWhitespace } from "util/stringUtils";

function parseAsJson<T>(rawJson: string) {
    if (isFalsyOrWhitespace(rawJson)) {
        return undefined;
    }
    return JSON.parse(rawJson) as T;
}

/**
 * Like `React.useState` but persists the value in session storage under `key`.
 */
export const usePersistedState = <T>(key: string, factory?: () => T) => {
    const value = React.useMemo<T | undefined>(() => {
        const rawData = sessionStorage.getItem(key);
        return rawData ? parseAsJson(rawData) : undefined;
    }, [key]);

    const [state, setState] = React.useState(value ?? (factory ? factory() : undefined));

    React.useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as [T, Dispatch<SetStateAction<T>>];
};

export default usePersistedState;
