import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";

import {
    AttendeeDriftMeasurement,
    DriftInformation,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

import { Event, IEvent } from "@fayr/common";

function calculateDesiredPlaybackRate(latency: number) {
    if (latency < config.streamSync.liveStream.minimumDrift) {
        return 1.0;
    }

    return 1 + Math.pow(0.05 * latency, 1.5);
}

class LiveStreamCatchUpStrategy implements IDriftSyncStrategy<number> {
    public measurementChange: IEvent<DriftInformation<number>>;

    constructor() {
        this.measurementChange = new Event<DriftInformation<number>>();
    }

    public apply(
        player: MediaPlayer,
        otherAttendeeDrifts: Array<AttendeeDriftMeasurement<number>>,
    ): void {
        const ownLatency = player.getLiveLatency();

        const playbackRate = calculateDesiredPlaybackRate(ownLatency);

        if (config.streamSync.loggingEnabled) {
            console.table([
                {
                    name: "you",
                    latency: fmt(ownLatency),
                    playbackRate,
                },
                ...otherAttendeeDrifts.map((info) => ({
                    name: info.attendeeName ?? "unknown",
                    latency: fmt(info.value),
                    playbackRate: calculateDesiredPlaybackRate(info.value),
                })),
            ]);
        }

        player.setPlaybackRate(playbackRate);
    }

    public measureOwnDrift(player: MediaPlayer): DriftInformation<number> {
        const measurement = player.getLiveLatency();

        const driftInfo: DriftInformation<number> = {
            driftedPastBoundary: measurement > config.streamSync.liveStream.minimumDrift,
            measurement,
        };

        this.measurementChange.publish(driftInfo);

        return driftInfo;
    }

    public synchronizeWithOthers(player: MediaPlayer, _: Array<AttendeeDriftMeasurement<number>>) {
        const currentPos = player.getPosition();
        player.seekTo(currentPos + player.getLiveLatency());
    }
}

function fmt(value: number | string) {
    return Number(Number(value).toFixed(2));
}

export default LiveStreamCatchUpStrategy;
