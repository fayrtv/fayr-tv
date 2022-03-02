import { MediaPlayer } from "amazon-ivs-player";
import React from "react";

import useContentSynchronizer from "./useContentSynchronizer";

// The maximum amount of seconds we can diverge from the most up to date attendee
const maximumLatencyInSeconds = 3;

export default function useStreamContentSynchronizer(
    ownId: string,
    player: MediaPlayer | undefined,
) {
    const onSynchronize = React.useCallback(
        (sanitizedMeasurements: Array<number>) => {
            if (!player) {
                return;
            }

            const currentLatency = player.getLiveLatency();
            const bestLatency = Math.min(...sanitizedMeasurements);

            // Two conditions should be met to start the resynchronization process:
            // 1. We need to be above an arbitrary border. If we would start synchronizing streams once the stream is even 0.5s past the source, it would get annoying fast
            // 2. Someone else must be better than we are. If we start synchronizing without having other catch up, then we would already be the best participant, and
            // would get further ahead on top
            if (currentLatency > maximumLatencyInSeconds && bestLatency < currentLatency) {
                player.setPlaybackRate(
                    130.641 - 129.6778 * Math.pow(Math.E, -0.0002520927 * currentLatency),
                );
            }

            if (currentLatency <= maximumLatencyInSeconds) {
                player.setPlaybackRate(1);
            }
        },
        [player],
    );

    React.useEffect(() => {
        if (!player || player.isLiveLowLatency()) {
            return;
        }

        // TODO: Check if this helps
        player.setLiveLowLatencyEnabled(true);
    }, [player]);

    useContentSynchronizer(ownId, player, () => player!.getLiveLatency(), onSynchronize);
}
