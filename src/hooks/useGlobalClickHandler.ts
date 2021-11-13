// Framework
import * as React from "react";

export const useGlobalClickHandler = (
    callback: ((event: MouseEvent) => void) | ((event: MouseEvent) => Promise<void>),
    additionalDeps: Array<unknown> = [],
) => {
    React.useEffect(() => {
        document.body.addEventListener("click", callback);

        return () => document.body.removeEventListener("click", callback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...additionalDeps]);
};

export default useGlobalClickHandler;
