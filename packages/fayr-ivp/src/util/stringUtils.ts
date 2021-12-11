export function isFalsyOrWhitespace(value: undefined | null): true;
export function isFalsyOrWhitespace(value: string): boolean;
export function isFalsyOrWhitespace(value: string | undefined | null) {
    if (!value) {
        return true;
    }
    return value.trim() === "";
}
