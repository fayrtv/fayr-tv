import { ConsoleLogger, Logger, LogLevel } from "amazon-chime-sdk-js";
import { injectable } from "inversify";

@injectable()
export default class LogProvider {
    public get logger(): Logger {
        return this._logger;
    }

    private _logger: Logger;

    constructor() {
        this._logger = new ConsoleLogger("SDK", LogLevel.ERROR);
    }
}
