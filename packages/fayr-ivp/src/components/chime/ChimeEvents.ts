import { injectable } from "inversify";

import { Event } from "@fayr/common";

import IChimeEvents from "./interfaces/IChimeEvents";

@injectable()
export default class ChimeEvents implements IChimeEvents {
    public get roomLeft(): Event<void> {
        return this._roomLeft;
    }

    constructor(private _roomLeft: Event<void> = new Event<void>()) {}
}
