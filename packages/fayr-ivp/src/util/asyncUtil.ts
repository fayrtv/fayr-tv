export const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const withTimeoutAfter = <T extends unknown>(promise: Promise<T>, timeoutInMs: number) =>
    Promise.race([promise, delay(timeoutInMs)]);
