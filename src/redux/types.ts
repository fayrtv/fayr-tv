// Framework
import Redux from "redux";

export type ReducerAction<T> = Redux.Action & {
	payload: T;
}