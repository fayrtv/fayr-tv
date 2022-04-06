import * as React from "react";

import { SocketContext } from "components/chime/SocketContextProvider";
import { SocketMessage } from "components/chime/interfaces/ISocketProvider";

/**
 * Conveniently exposes the {@link SocketContext} with additional helper functions
 */
const useSocket = () => {
    const result = React.useContext(SocketContext);
    const { socket: socketProvider } = result;

    const [waitReadyQueue, setWaitReadyQueue] = React.useState<SocketMessage<any>[]>([]);

    const sendWhenReady = <T>(message: SocketMessage<T>) => {
        if (socketProvider) {
            socketProvider.send(message);
        } else {
            setWaitReadyQueue((curr) => [...curr, message]);
        }
    };

    React.useEffect(() => {
        if (socketProvider && waitReadyQueue.length) {
            waitReadyQueue.forEach((dto) => socketProvider.send(dto));
        }
    }, [socketProvider, waitReadyQueue]);

    return { ...result, sendWhenReady };
};

export default useSocket;
