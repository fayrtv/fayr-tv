import { MediaPlayer } from "amazon-ivs-player";

export interface IDriftSyncStrategy<T> {
    apply(player: MediaPlayer, otherAttendeeMeasurements: Array<AttendeeDriftMeasurement<T>>): void;
    measureOwn(player: MediaPlayer): T;
}

export type AttendeeDriftMeasurement<T> = {
    value: T;
    /**
     * Unix timestamp (seconds since epoch) when this measurement was taken
     */
    measuredAt: number;

    attendeeName?: string;
};
