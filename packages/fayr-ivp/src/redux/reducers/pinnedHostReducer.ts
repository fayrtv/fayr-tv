import { Nullable } from "types/global";

import { ReducerAction } from "../types";

const UPDATE_PINNED_HOST = "UPDATE_PINNED_HOST";

type PinnedHostAction = ReducerAction<Nullable<string>>;

export const updatePinnedHost = (newHost: Nullable<string>): ReducerAction<Nullable<string>> => ({
    type: UPDATE_PINNED_HOST,
    payload: newHost,
});

export type PinnedHostReducerState = Nullable<string>;

const initialState: PinnedHostReducerState = null;

export const reducer = (
    state: PinnedHostReducerState = initialState,
    action: PinnedHostAction,
): PinnedHostReducerState => {
    switch (action.type) {
        case UPDATE_PINNED_HOST:
            return action.payload;
        default:
            return state;
    }
};
