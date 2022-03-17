import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";
import * as moment from "moment";
import React from "react";

import { useAttendeeInfo } from "hooks/useAttendeeInfo";
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

    const { getAttendee } = useAttendeeInfo();

    React.useEffect(() => {
        const intervalHandle = window.setInterval(() => {
            if (!player || attendeeTsMap.current.size === 0) {
                return;
            }

            const currentUtcTime = moment.utc().unix();

            attendeeTsMap.current.forEach((value, key) => {
                const lastHeartbeatAgo = currentUtcTime - value.measuredAt;
                if (lastHeartbeatAgo > config.streamSync.heartBeatInactiveThreshold) {
                    attendeeTsMap.current.delete(key);

                    if (config.streamSync.loggingEnabled) {
                        console.log(
                            `No heartbeat from ${value.attendeeName} in the past ${config.streamSync.heartBeatInactiveThreshold} seconds.`,
                        );
                    }
                }
            });

            strategy.apply(player, Array.from(attendeeTsMap.current.values()));
        }, config.streamSync.synchronizationInterval);

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
                // Exclude our own ID here
                if (attendeeId === ownId) {
                    return Promise.resolve();
                }

                attendeeTsMap.current.set(attendeeId, {
                    value: measurement,
                    measuredAt: eventTimestamp,
                    attendeeName: getAttendee(attendeeId)?.name,
                });
                return Promise.resolve();
            },
        );
    }, [socket, attendeeTsMap, ownId, getAttendee]);

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
        }, config.streamSync.heartBeatInterval);

        return () => window.clearInterval(intervalHandle);
    }, [socket, player, ownId, strategy]);
}
