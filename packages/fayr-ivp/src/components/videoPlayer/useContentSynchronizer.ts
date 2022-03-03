import { MediaPlayer } from "amazon-ivs-player";
import * as moment from "moment";
import React from "react";

import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/types";
import {
    AttendeeDriftMeasurement,
    IDriftSyncStrategy,
} from "components/videoPlayer/driftSyncStrategies/interfaces";

import { HeartBeat } from "./types";

export default function useContentSynchronizer<T>(
    ownId: string,
    player: MediaPlayer | undefined,
    strategy: IDriftSyncStrategy<T>,
) {
    const attendeeTsMap = React.useRef(new Map<string, AttendeeDriftMeasurement<T>>());

    React.useEffect(() => {
        const intervalHandle = window.setInterval(() => {
            if (!player) {
                return;
            }
            strategy.apply(player, Array.from(attendeeTsMap.current.values()));
        }, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [player, strategy]);

    const { socket } = useSocket();

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<HeartBeat<T>>(
            SocketEventType.TimeStampHeartBeat,
            ({ attendeeId, measurement, eventTimestamp }) => {
                attendeeTsMap.current.set(attendeeId, {
                    measurement,
                    measuredAt: eventTimestamp,
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
            socket.send<HeartBeat<T>>({
                messageType: SocketEventType.TimeStampHeartBeat,
                payload: {
                    attendeeId: ownId,
                    measurement: strategy.measureOwn(player),
                    eventTimestamp: moment.utc().unix(),
                },
            });
        }, 1000);

        return () => window.clearInterval(intervalHandle);
    }, [socket, player, ownId, strategy]);
}
