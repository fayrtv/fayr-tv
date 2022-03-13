import { MediaPlayer } from "amazon-ivs-player";
import * as moment from "moment";

import {
    AttendeeDriftMeasurement,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

/**
 * The minimum time distance from the attendee ahead at which to start synchronizing streams
 */
const MINIMUM_DRIFT_FOR_SYNC = 3;

const liveStreamCatchUpStrategy: IDriftSyncStrategy<number> = {
    apply(
        player: MediaPlayer,
        otherAttendeeLatencies: Array<AttendeeDriftMeasurement<number>>,
    ): void {
        const currentUtcTime = moment.utc().unix();

        // Sanitize the positions
        const utcSanitizedMeasurements = otherAttendeeLatencies.map((info) => {
            // This is the difference between the measurements and the current utc time
            const secondsToSanitize = currentUtcTime - info.measuredAt;
            return info.measurement + secondsToSanitize;
        });

        const ownLatency = player.getLiveLatency();
        const bestAttendeeLatency = Math.min(...utcSanitizedMeasurements);
        const shouldCatchUp = ownLatency > MINIMUM_DRIFT_FOR_SYNC;
        const ownLatencyIsBest = ownLatency < bestAttendeeLatency;

        // Two conditions should be met to start the resynchronization process:
        // 1. Our delay must be below a certain amount. If we were to start synchronizing streams once the stream
        //    is even 0.5s past the source, it would start to get annoying
        // 2. We need to have someone to catch up to.
        if (shouldCatchUp && !ownLatencyIsBest) {
            const playbackRate = 130.641 - 129.6778 * Math.pow(Math.E, -0.0002520927 * ownLatency);
            player.setPlaybackRate(playbackRate);
            console.log(`Need to catch up. Set playback rate to ${playbackRate}`);
            return;
        }

        player.setPlaybackRate(1.0);
    },
    measureOwn(player: MediaPlayer): number {
        return player.getLiveLatency();
    },
};

export default liveStreamCatchUpStrategy;
