import { injectable } from "inversify";
import Event from "util/event";

import IChimeEvents from "./interfaces/IChimeEvents";

@injectable()
export default class ChimeEvents implements IChimeEvents {
    private _roomLeft: Event<void>;
    public get roomLeft(): Event<void> {
        return this._roomLeft;
    }

    constructor() {
        this._roomLeft = new Event<void>();
    }
}
