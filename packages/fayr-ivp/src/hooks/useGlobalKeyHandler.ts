// Framework
import * as React from "react";
import { CouldBeArray, ensureArray } from "util/collectionUtil";

export const useGlobalKeyHandler = (
    keysOrCodes: CouldBeArray<string>,
    callback: () => void | Promise<void>,
    additionalDeps: Array<unknown> = [],
) => {
    const keysOrCodesArray = ensureArray(keysOrCodes);

    const filteredCb = React.useCallback(
        (event: KeyboardEvent) => {
            if (keysOrCodesArray.some((x) => event.key === x || event.code === x)) {
                callback();
            }
        },
        [callback, keysOrCodesArray],
    );

    React.useEffect(() => {
        window.addEventListener("keyup", filteredCb);
        return () => window.removeEventListener("keyup", filteredCb);
    }, [filteredCb, ...additionalDeps]);
};

export default useGlobalKeyHandler;
