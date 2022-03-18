import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";

import {
    AttendeeDriftMeasurement,
    DriftInformation,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

function calculateDesiredPlaybackRate(latency: number) {
    if (latency < config.streamSync.liveStream.minimumDrift) {
        return 1.0;
    }

    return 1 + Math.pow(0.05 * latency, 1.5);
}

const liveStreamCatchUpStrategy: IDriftSyncStrategy<number> = {
    apply(player: MediaPlayer, otherAttendeeDrifts: Array<AttendeeDriftMeasurement<number>>): void {
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
                    latency: info.value,
                    playbackRate: calculateDesiredPlaybackRate(info.value),
                })),
            ]);
        }

        player.setPlaybackRate(playbackRate);
    },

    measureOwnDrift(player: MediaPlayer): DriftInformation<number> {
        const measurement = player.getLiveLatency();
        return {
            driftedPastBoundary: measurement > config.streamSync.liveStream.minimumDrift,
            measurement,
        };
    },

    synchronizeWithOthers(player: MediaPlayer, _: Array<AttendeeDriftMeasurement<number>>) {
        const currentPos = player.getPosition();
        player.seekTo(currentPos + player.getLiveLatency());
    },
};

function fmt(value: number | string) {
    return Number(Number(value).toFixed(1));
}

export default liveStreamCatchUpStrategy;
