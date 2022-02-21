import { MediaPlayer } from "amazon-ivs-player";
import React from "react";

import useContentSynchronizer from "./useContentSynchronizer";

// The maximum amount of seconds we can diverge from the most up to date attendee
const maximumDifferenceInSeconds = 2;

export default function useStaticStreamSynchronizer(
    ownId: string,
    player: MediaPlayer | undefined,
) {
    const onSynchronize = React.useCallback(
        (sanitizedPositions: Array<number>) => {
            if (!player) {
                return;
            }

            const currentPosition = player.getPosition();
            const mostUpToDateTime = Math.max(...sanitizedPositions);

            if (mostUpToDateTime - maximumDifferenceInSeconds > currentPosition) {
                player.seekTo(mostUpToDateTime);
            }
        },
        [player],
    );

    useContentSynchronizer(ownId, player, () => player!.getPosition(), onSynchronize);
}
