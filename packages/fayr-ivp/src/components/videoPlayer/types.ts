export type HeartBeat<T> = {
    attendeeId: string;
    measurement: T;

    /**
     * Unix timestamp (seconds since epoch) when this measurement was taken
     */
    eventTimestamp: number;
};
