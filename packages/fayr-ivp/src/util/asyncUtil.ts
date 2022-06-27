export const delay = (ms: number, abortSignal?: AbortSignal) =>
    new Promise<void>((res) => {
        let timeoutHandle: number;

        // If the signal is aborted, we need to cancel the timeout, but still resolve.
        const abortHandler = () => {
            clearTimeout(timeoutHandle);
            res();
        };

        abortSignal?.addEventListener("abort", abortHandler);

        timeoutHandle = window.setTimeout(() => {
            // If the timeout runs, we need to clean up our listener
            abortSignal?.removeEventListener("abort", abortHandler);
            res();
        }, ms);
    });

export const withTimeoutAfter = <T extends unknown>(promise: Promise<T>, timeoutInMs: number) =>
    Promise.race([promise, delay(timeoutInMs)]);

/**
 * Similar to window.setInterval, but the executor is always awaited ahead of the next execution cycle
 * @param executor Callback to run when interval is tripped
 * @param delayBetween Delay in between executions
 * @param initialDelay Optional initial delay
 * @param abortSignal Optional abort signal
 */
export const setIntervalAsync = async (
    executor: () => Promise<void>,
    delayBetween: number,
    initialDelay?: number,
    abortSignal?: AbortSignal,
) => {
    if (!!initialDelay) {
        await delay(initialDelay);
    }

    try {
        while (!abortSignal?.aborted ?? true) {
            await executor();
            await delay(delayBetween);
        }
    } catch (e: any) {
        if (e.name === "AbortError") {
            return;
        }
        throw e;
    }
};
