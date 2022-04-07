export function isFalsyOrWhitespace(value: undefined | null): true;
export function isFalsyOrWhitespace(value?: string): boolean;
export function isFalsyOrWhitespace(value?: string | null): boolean {
    if (!value) {
        return true;
    }
    return value.trim() === "";
}
