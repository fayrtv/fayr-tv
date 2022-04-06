import { useState, useEffect, useLayoutEffect, useRef, Dispatch, SetStateAction } from "react";

type UseStateTuple<S> = [S, Dispatch<SetStateAction<S>>];
type InitialState<S> = S | (() => S);
type Callback<S> = (value: S) => void;

const useStateWithEffect = <T>(
    initialState: InitialState<T>,
    callback: Callback<T>,
): UseStateTuple<T> => {
    const [state, setState] = useState(initialState);

    useEffect(() => callback(state), [state, callback]);

    return [state, setState];
};

const useStateWithLayoutEffect = <T>(
    initialState: InitialState<T>,
    callback: Callback<T>,
): UseStateTuple<T> => {
    const [state, setState] = useState(initialState);

    useLayoutEffect(() => callback(state), [state, callback]);

    return [state, setState];
};

const useStateWithLazyCallback = <T>(
    initialValue: InitialState<T>,
): [T, (newValue: T, callback: Callback<T>) => void] => {
    const callbackRef = useRef(null);

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(value);

            callbackRef.current = null;
        }
    }, [value]);

    const setValueWithCallback = (newValue, callback) => {
        callbackRef.current = callback;

        return setValue(newValue);
    };

    return [value, setValueWithCallback];
};

export { useStateWithLayoutEffect, useStateWithLazyCallback, useStateWithEffect };
