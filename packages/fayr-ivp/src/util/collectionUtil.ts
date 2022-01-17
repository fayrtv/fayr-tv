export type CouldBeArray<T> = T | Array<T>;

export const ensureArray = <T>(potentialArray: CouldBeArray<T>): Array<T> => {
    if (potentialArray instanceof Array) {
        return potentialArray;
    }
    return [potentialArray];
};

export const range = (amount: number): Array<number> => {
    return [...Array.from(Array(amount).keys())];
};
