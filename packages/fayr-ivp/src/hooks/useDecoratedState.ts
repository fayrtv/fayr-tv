// Framework
import { useState } from "react";

type InitialState<T> = T | (() => T);

/**
 * Like useState, but allows to decorate the setter with another side effect callback
 * @param  {InitialState<T>} initialValue Initial value of the state
 * @param  {(val: T) => void} decoratedCb Initial value of the state
 */
export const useDecoratedState = <T>(
    initialValue: InitialState<T>,
    decoratedCb: (val: T) => void,
) => {
    const [state, setState] = useState<T>(initialValue);

    const decoratedSetter = (val: T) => {
        decoratedCb(val);
        setState(val);
    };

    return [state, decoratedSetter];
};

export default useDecoratedState;
