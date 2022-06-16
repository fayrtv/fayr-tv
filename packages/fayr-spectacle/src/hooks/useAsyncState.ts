import React from "react";

export const useAsyncState = <T>(
    initializer: () => Promise<T>,
    dependencies: React.DependencyList = [],
): [T | null, React.Dispatch<T | null>, boolean] => {
    const [value, setValue] = React.useState<T | null>(null);

    React.useEffect(() => {
        const lazyInitializer = async () => {
            setValue(await initializer());
        };
        lazyInitializer();
    }, [dependencies]);

    return [value, setValue, value !== null];
};
