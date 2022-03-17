import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";
import * as moment from "moment";

import {
    AttendeeDriftMeasurement,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

function determineCurrentLatency(utcNowUnix: number, info: AttendeeDriftMeasurement<number>) {
    const secondsToSanitize = utcNowUnix - info.measuredAt;
    return info.value + secondsToSanitize;
}

type LogRow = {
    name: string;
    latency: number;
    shouldCatchUp?: boolean;
};

const liveStreamSyncAllStrategy: IDriftSyncStrategy<number> = {
    apply(
        player: MediaPlayer,
        otherAttendeeLatencies: Array<AttendeeDriftMeasurement<number>>,
    ): void {
        const currentUtcTime = moment.utc().unix();

        const othersSanitizedLatencies = otherAttendeeLatencies.map((l) =>
            determineCurrentLatency(currentUtcTime, l),
        );

        const ownLatency = player.getLiveLatency();
        const bestAttendeeLatency = Math.min(...othersSanitizedLatencies);
        const shouldCatchUp = ownLatency > config.streamSync.liveStream.minimumDrift;
        const ownLatencyIsBest = ownLatency < bestAttendeeLatency;

        if (config.streamSync.loggingEnabled) {
            console.table([
                {
                    name: "you",
                    latency: fmt(ownLatency),
                    shouldCatchUp,
                },
                ...otherAttendeeLatencies.map((info) => ({
                    name: info.attendeeName ?? "unknown",
                    latency: fmt(determineCurrentLatency(currentUtcTime, info)),
                })),
            ] as LogRow[]);
        }

        // Two conditions should be met to start the resynchronization process:
        // 1. Our delay must be below a certain amount. If we were to start synchronizing streams once the stream
        //    is even 0.5s past the source, it would start to get annoying
        // 2. We need to have someone to catch up to.
        if (shouldCatchUp && !ownLatencyIsBest) {
            const playbackRate = 1 + Math.pow(0.05 * ownLatency, 1.5);
            player.setPlaybackRate(playbackRate);
            console.log(`Need to catch up. Set playback rate to ${playbackRate.toFixed(4)}`);
            return;
        }

        player.setPlaybackRate(1.0);
    },
    measureOwn(player: MediaPlayer): number {
        return player.getLiveLatency();
    },
};

function fmt(value: number | string) {
    return Number(Number(value).toFixed(1));
}

export default liveStreamSyncAllStrategy;
