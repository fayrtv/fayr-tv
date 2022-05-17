import { ServerResponse } from "http";

/**
 * Prop type to be used when {@link redirectServerSide} gets returned directly from `getServerSideProps`.
 */
export type RedirectProps = {};

export const redirectServerSide = (res: ServerResponse, location: string) => {
    res.writeHead(301, { Location: location });
    res.end();
    return { props: {} };
};
