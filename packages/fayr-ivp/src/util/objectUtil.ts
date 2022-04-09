export const getPropertyCaseInsensitive = <TObj, TRetVal = string>(
    object: TObj,
    key: keyof TObj,
): TRetVal => {
    const keyLower = key.toString().toLowerCase();
    for (let [entryKey, value] of Object.entries(object)) {
        if (entryKey.toLowerCase() === keyLower) {
            return value;
        }
    }
    throw new Error("Property not found");
};
