import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";
import * as moment from "moment";

import {
    AttendeeDriftMeasurement,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

const videoCatchUpStrategy: IDriftSyncStrategy<number> = {
    apply(
        player: MediaPlayer,
        otherAttendeePositions: Array<AttendeeDriftMeasurement<number>>,
    ): void {
        const currentUtcTime = moment.utc().unix();

        // Sanitize the positions
        const utcSanitizedMeasurements = otherAttendeePositions.map((info) => {
            // This is the difference between the measurements and the current utc time
            const secondsToSanitize = currentUtcTime - info.measuredAt;
            return info.measurement + secondsToSanitize;
        });

        const currentPosition = player.getPosition();
        const mostUpToDateTime = Math.max(...utcSanitizedMeasurements);

        if (mostUpToDateTime - config.streamSync.staticStream.minimumDrift > currentPosition) {
            player.seekTo(mostUpToDateTime);
        }
    },
    measureOwn(player: MediaPlayer): number {
        return player.getPosition();
    },
};

export default videoCatchUpStrategy;
