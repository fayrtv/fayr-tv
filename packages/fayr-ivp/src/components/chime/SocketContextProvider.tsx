import React from "react";
import { Nullable } from "types/global";

// Types
import { ISocketProvider } from "./types";

type Context = {
    socket?: ISocketProvider;
    setSocket: (provider: Nullable<ISocketProvider>) => void;
};

export const SocketContext = React.createContext<Context>({
    socket: undefined,
    setSocket: () => void 0,
});

export const SocketContextProvider: React.FC = ({ children }) => {
    const [socket, setSocket] = React.useState<ISocketProvider>();

    const submitNewSocket = React.useCallback(
        (socket: Nullable<ISocketProvider>) => {
            if (!socket) {
                return;
            }

            setSocket(socket);
        },
        [setSocket],
    );

    return (
        <SocketContext.Provider
            value={{
                socket,
                setSocket: submitNewSocket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
