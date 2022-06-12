import React from "react";

export default function useAsyncState<T>(initializer: () => Promise<T>): {
    loading: boolean;
    state: T;
} {
    const [state, setState] = React.useState<T | undefined>();

    React.useEffect(() => {
        const init = async () => {
            setState(await initializer());
        };

        init();
    }, []);

    return {
        loading: state === undefined,
        state: state!,
    };
}
