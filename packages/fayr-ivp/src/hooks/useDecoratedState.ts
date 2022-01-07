// Framework
import { useState } from "react";

type InitialState<T> = T | (() => T);

export const useDecoratedState = <T>(
    initialState: InitialState<T>,
    decoratedCb: (val: T) => void,
) => {
    const [state, setState] = useState<T>();

    const decoratedSetter = (val: T) => {
        decoratedCb(val);
        setState(val);
    };

    return [state, decoratedSetter];
};

export default useDecoratedState;
