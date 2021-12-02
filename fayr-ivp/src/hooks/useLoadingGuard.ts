import React from "react";

/**
 * Wraps around `loadFunc` to provide an `isLoading` flag which turns to true once either
 * 1. the callback has resolved (and the optional `onCompletion` has run), or
 * 2. `requiresLoading` has been updated to `false`.
 * @param requiresLoading Indicates whether the `loadFunc` must be started
 * @param loadFunc An async callback representing a background operation required to get component data
 * @param onCompletion (optional) What to do with the result of `loadFunc`
 */
export default function useLoadingGuard<T>(
    requiresLoading: boolean,
    loadFunc: () => Promise<T>,
    onCompletion?: (result: T) => void,
) {
    const [isLoading, setLoading] = React.useState(requiresLoading);

    React.useEffect(() => {
        if (!requiresLoading) {
            setLoading(false);
            return;
        }

        loadFunc().then((result) => {
            if (onCompletion) {
                onCompletion(result);
            }
            setLoading(false);
        });
    }, [requiresLoading, loadFunc, onCompletion]);

    return { isLoading };
}
