// Framework
import createSagaMiddleware from "@redux-saga/core";
import * as config from "config";
import * as redux from "redux";
import { applyMiddleware, compose } from "redux";
// Functionality
import {
    reducer as chatMessageReducer,
    ChatMessageReducerState,
} from "redux/reducers/chatMessageReducer";
import { reducer as votingReducer, VotingReducerState } from "redux/reducers/votingReducer";

import { MeetingMetaData } from "../components/chimeWeb/Meeting/meetingTypes";
import {
    reducer as attendeeReducer,
    ReducerState as AttendeeReducerState,
} from "./reducers/attendeeReducer";
import {
    meetingStateReducerSaga,
    reducer as meetingStateReducer,
} from "./reducers/meetingStateReducer";
import { reducer as pinnedHostReducer, PinnedHostReducerState } from "./reducers/pinnedHostReducer";

export const GLOBAL_RESET = "RESET";

export type Reducers = {
    attendeeReducer: AttendeeReducerState;
    chatMessageReducer: ChatMessageReducerState;
    meetingStateReducer: MeetingMetaData;
    pinnedHostReducer: PinnedHostReducerState;
    votingReducer: VotingReducerState;
};

export type ReduxStore = redux.Store & {
    dispatch: unknown;
} & Reducers;

export const GlobalResetAction = () => ({
    type: GLOBAL_RESET,
});

const sagaMiddleWare = createSagaMiddleware();

export const store = redux.createStore(
    redux.combineReducers<Reducers>({
        attendeeReducer,
        chatMessageReducer,
        meetingStateReducer,
        pinnedHostReducer,
        votingReducer,
    }),
    compose(
        applyMiddleware(sagaMiddleWare),
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
            ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
            : (x: any) => x,
    ),
);

sagaMiddleWare.run(meetingStateReducerSaga);

export default store;
