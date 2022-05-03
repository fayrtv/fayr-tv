import { Container } from "inversify";
import "reflect-metadata";
import Types from "types/inject";

import { AudioVideoManager } from "components/chime/AudioVideoManager";
import ChimeEvents from "components/chime/ChimeEvents";
import SocketProvider from "components/chime/SocketProvider";
import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";
import ISocketProvider from "components/chime/interfaces/ISocketProvider";

import LogProvider from "./components/chime/LogProvider";
import RoomManager from "./components/chime/RoomManager";
import IChimeEvents from "./components/chime/interfaces/IChimeEvents";
import IRoomManager from "./components/chime/interfaces/IRoomManager";

const container = new Container();

container
    .bind<IAudioVideoManager>(Types.IAudioVideoManager)
    .to(AudioVideoManager)
    .inSingletonScope();

container
    .bind<ISocketProvider>(Types.ISocketProvider)
    .to(SocketProvider)
    .inSingletonScope();
container
    .bind<LogProvider>(Types.LogProvider)
    .to(LogProvider)
    .inSingletonScope();
container
    .bind<IRoomManager>(Types.IRoomManager)
    .to(RoomManager)
    .inSingletonScope();
container
    .bind<IChimeEvents>(Types.IChimeEvents)
    .to(ChimeEvents)
    .inSingletonScope();

export { container };
