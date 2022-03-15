import * as React from "react";

import { SocketContext } from "components/chime/SocketContextProvider";
import { SocketMessage } from "components/chime/types";

/**
 * Conveniently exposes the {@link SocketContext} with additional helper functions
 */
const useSocket = () => {
    const result = React.useContext(SocketContext);
    const { socket } = result;

    const [waitReadyQueue, setWaitReadyQueue] = React.useState<SocketMessage<any>[]>([]);

    const sendWhenReady = <T>(message: SocketMessage<T>) => {
        if (socket) {
            socket.send(message);
        } else {
            setWaitReadyQueue((curr) => [...curr, message]);
        }
    };

    React.useEffect(() => {
        if (socket && waitReadyQueue.length) {
            waitReadyQueue.forEach((dto) => socket.send(dto));
        }
    }, [socket, waitReadyQueue]);

    return { ...result, sendWhenReady };
};

export default useSocket;
