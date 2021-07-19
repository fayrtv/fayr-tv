export type CouldBeArray<T> = T | Array<T>;

export const ensureArray = <T>(potentialArray: CouldBeArray<T>): Array<T> => {
	if (potentialArray instanceof Array) {
		return potentialArray;
	}
	return [potentialArray];
}