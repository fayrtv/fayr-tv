import { MediaPlayer } from "amazon-ivs-player";
import { IEventConsumer } from "util/event";

export interface IDriftSyncStrategy<T> {
    apply(player: MediaPlayer, otherAttendeeDrifts: Array<AttendeeDriftMeasurement<T>>): void;
    measureOwnDrift(player: MediaPlayer): DriftInformation<T>;
    measurementChange: IEventConsumer<DriftInformation<T>>;
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

export type DriftInformation<T> = {
    driftedPastBoundary: boolean;
    measurement: T;
};
