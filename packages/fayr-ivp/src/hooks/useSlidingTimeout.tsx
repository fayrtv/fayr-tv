import React from "react";

/**
 * In case you need a timeout, but it might be called again before the first one runs out
 * Will take care of properly cleaning up the old timeout and keeping the timeout running in a sliding
 * expiration fashion
 */
export default function useSlidingTimeout() {
    const timeoutRef = React.useRef<number | null>(null);

    const runTimeout = (cb: () => void, timeout: number) => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(cb, timeout);
    };

    return runTimeout;
}
