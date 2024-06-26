export type Callback<T> = (data: T) => void;

export interface IEventConsumer<T> {
    register: (callback: Callback<T>) => void;
    unregister: (callback: Callback<T>) => void;
}

export interface IEventPublisher<T> {
    publish: (data: T) => void;
}

export interface IEvent<T> extends IEventConsumer<T>, IEventPublisher<T> {}

export class Event<T> implements IEvent<T> {
    private _callbacks: Array<Callback<T>>;

    constructor() {
        this._callbacks = [];
    }

    public register(callback: (data: T) => void) {
        this._callbacks.push(callback);
    }

    public unregister(callback: (data: T) => void) {
        const index = this._callbacks.indexOf(callback);
        if (index > -1) {
            this._callbacks.splice(index, 1);
        }
    }

    public publish(data: T) {
        for (const cb of this._callbacks) {
            cb(data);
        }
    }
}

export default Event;
