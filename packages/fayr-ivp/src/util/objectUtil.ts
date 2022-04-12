export const getPropertyCaseInsensitive = <TObj, TRetVal = string>(
    object: TObj,
    key: keyof TObj,
): TRetVal | undefined => {
    const keyLower = key.toString().toLowerCase();
    for (let [entryKey, value] of Object.entries(object)) {
        if (entryKey.toLowerCase() === keyLower) {
            return value;
        }
    }
    return undefined;
};
