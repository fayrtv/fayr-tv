import React from "react";

import { SocketEventType, SocketMessage } from "components/chime/interfaces/ISocketProvider";

import useSocket from "./useSocket";

type ReturnTuple = [
    boolean,
    <T>(
        message: SocketMessage<T>,
        eventToWaitFor: SocketEventType,
        timeout?: number | undefined,
    ) => Promise<void>,
];

/**
 * Sends a message through a socket, and then waits for an event to come in, returning a "waiting" state to represent the call status
 */
export default function useSocketResponse(eventToWaitFor: SocketEventType): ReturnTuple {
    const { socket } = useSocket();
    const [running, setRunning] = React.useState(false);

    const send = async <T>(message: SocketMessage<T>, timeout?: number) => {
        if (!socket) {
            throw new Error("Socket was not initialized yet");
        }

        const promise = new Promise<void>((res, rej) => {
            // Setup a listener for the reverse event
            let listenerCleanup: (() => void) | undefined = undefined;
            let timeoutHandle: number = -1;

            const cleanUp = () => {
                listenerCleanup?.();
                window.clearTimeout(timeoutHandle);
            };

            if (!!timeout) {
                timeoutHandle = window.setTimeout(() => {
                    rej();
                    cleanUp();
                }, timeout);
            }

            listenerCleanup = socket.addListener(eventToWaitFor, async (_) => {
                res();
                cleanUp();
            });
            socket.send(message);
        });

        try {
            setRunning(true);
            await promise;
        } finally {
            setRunning(false);
        }
    };

    return [running, send];
}
