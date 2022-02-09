export const withoutPropagation =
    (handler: () => void): React.MouseEventHandler<HTMLDivElement> =>
    (e) => {
        e.stopPropagation();
        e.preventDefault();

        handler();
    };

export const withoutPropagationAsync =
    (handler: () => Promise<void>): React.MouseEventHandler<HTMLDivElement> =>
    async (e) => {
        e.stopPropagation();
        e.preventDefault();

        await handler();
    };
