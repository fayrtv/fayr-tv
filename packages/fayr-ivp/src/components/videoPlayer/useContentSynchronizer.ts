import { MediaPlayer } from "amazon-ivs-player";
import * as moment from "moment";
import React from "react";

import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/types";

import { HeartBeat } from "./types";

type AttendeePositionInfo = {
    measurement: number;
    measurementTimeUtcInSeconds: number;
};

export default function useContentSynchronizer(
    ownId: string,
    player: MediaPlayer | undefined,
    measureCb: () => number,
    synchronizeCb: (measurements: Array<number>) => void,
) {
    const { socket } = useSocket();

    const attendeeTsMap = React.useMemo(() => new Map<string, AttendeePositionInfo>(), []);

    const synchronizeTimeStamps = React.useCallback(() => {
        if (!player) {
            return;
        }

        const currentUtcTime = moment.utc().unix();

        // Sanitize the positions
        const utcSanitizedMeasurements = Array.from(attendeeTsMap.values()).map((info) => {
            // This is the difference between the measurements and the current utc time
            const secondsToSanitize = currentUtcTime - info.measurementTimeUtcInSeconds;
            return info.measurement + secondsToSanitize;
        });

        synchronizeCb(utcSanitizedMeasurements);
    }, [attendeeTsMap, player, synchronizeCb]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<HeartBeat>(
            SocketEventType.TimeStampHeartBeat,
            ({ attendeeId, measurement, measurementTimeUtcInSeconds }) => {
                attendeeTsMap.set(attendeeId, {
                    measurement,
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
            socket.send<HeartBeat>({
                messageType: SocketEventType.TimeStampHeartBeat,
                payload: {
                    attendeeId: ownId,
                    measurement: measureCb(),
                    measurementTimeUtcInSeconds: moment.utc().unix(),
                },
            });
        }, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [socket, player, ownId, measureCb]);

    React.useEffect(() => {
        const intervalHandle = window.setInterval(synchronizeTimeStamps, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [synchronizeTimeStamps]);
}
