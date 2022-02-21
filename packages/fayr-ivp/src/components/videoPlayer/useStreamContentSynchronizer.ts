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

            // Refresh if our latency is greater than the maximum latency and someone else is already better off than
            // we are. Otherwise, it is probably better to allow the stream itself to control the latency. This is just a
            // way to avoid straying off too far from the best latency
            if (currentLatency > maximumLatencyInSeconds && bestLatency < currentLatency) {
                player.seekTo(player.getPosition() + 2);
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
