import { MediaPlayer } from "amazon-ivs-player";

export interface IDriftSyncStrategy<T> {
    apply(player: MediaPlayer, otherAttendeeDrifts: Array<AttendeeDriftMeasurement<T>>): void;
    measureOwnDrift(player: MediaPlayer): T;
    synchronizeWithOthers(
        player: MediaPlayer,
        otherAttendeeMeasurements: Array<AttendeeDriftMeasurement<T>>,
    ): void;
}

export type AttendeeDriftMeasurement<T> = {
    value: T;
    /**
     * Unix timestamp (seconds since epoch) when this measurement was taken
     */
    measuredAt: number;

    attendeeName?: string;
};
