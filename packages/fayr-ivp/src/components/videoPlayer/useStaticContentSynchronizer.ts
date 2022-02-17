import { MediaPlayer } from "amazon-ivs-player";
import * as moment from "moment";
import React from "react";

import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/types";

import { TimeStampHeartBeat } from "./types";

// The maximum amount of seconds we can diverge from the most up to date attendee
const maximumDifferenceInSeconds = 2;

type AttendeePositionInfo = {
    position: number;
    measurementTimeUtcInSeconds: number;
};

export default function useStaticStreamSynchronizer(
    ownId: string,
    player: MediaPlayer | undefined,
) {
    const { socket } = useSocket();

    const attendeeTsMap = React.useMemo(() => new Map<string, AttendeePositionInfo>(), []);

    const synchronizeTimeStamps = React.useCallback(() => {
        if (!player) {
            return;
        }

        const currentPosition = player.getPosition();
        const currentUtcTime = moment.utc().unix();

        // Sanitize the positions
        const sanitizedPositions = Array.from(attendeeTsMap.values()).map((info) => {
            // This is the difference between the measurements and the current utc time
            const secondsToSanitize = currentUtcTime - info.measurementTimeUtcInSeconds;
            return info.position + secondsToSanitize;
        });

        const mostUpToDateTime = Math.max(...sanitizedPositions);

        if (mostUpToDateTime - maximumDifferenceInSeconds > currentPosition) {
            player.seekTo(mostUpToDateTime);
        }
    }, [attendeeTsMap, ownId, player]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<TimeStampHeartBeat>(
            SocketEventType.TimeStampHeartBeat,
            ({ attendeeId, position, measurementTimeUtcInSeconds }) => {
                attendeeTsMap.set(attendeeId, {
                    position,
                    measurementTimeUtcInSeconds,
                });
                return Promise.resolve();
            },
        );
    }, [socket, attendeeTsMap]);

    React.useEffect(() => {
        if (!socket || !player) {
            return;
        }

        // We should send the position together with a UTC timestamp. This way,
        // we can then sanitize the actual position when the times are actually synchronized.
        // Otherwise our calculation will also include potential network delays.
        const intervalHandle = window.setInterval(() => {
            socket.send<TimeStampHeartBeat>({
                messageType: SocketEventType.TimeStampHeartBeat,
                payload: {
                    attendeeId: ownId,
                    position: player.getPosition(),
                    measurementTimeUtcInSeconds: moment.utc().unix(),
                },
            });
        }, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [socket, player, ownId]);

    React.useEffect(() => {
        const intervalHandle = window.setInterval(synchronizeTimeStamps, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [synchronizeTimeStamps]);
}
