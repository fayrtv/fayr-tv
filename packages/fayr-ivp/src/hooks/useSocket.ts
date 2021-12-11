// Framework
import * as React from "react";

import { SocketContext } from "../components/chime/SocketContextProvider";

export const useSocket = () => {
    const socket = React.useContext(SocketContext);
    return socket;
};

export default useSocket;
