// Framework
import * as redux from "redux";
import { compose } from "redux";
// Functionality
import {
    reducer as chatMessageReducer,
    ChatMessageReducerState,
} from "redux/reducers/chatMessageReducer";
import {
    reducer as participantVideoReducer,
    ParticipantVideoReducerState,
} from "redux/reducers/participantVideoReducer";
import { reducer as votingReducer, VotingReducerState } from "redux/reducers/votingReducer";

import { reducer as pinnedHostReducer, PinnedHostReducerState } from "./reducers/pinnedHostReducer";

export type Reducers = {
    chatMessageReducer: ChatMessageReducerState;
    participantVideoReducer: ParticipantVideoReducerState;
    pinnedHostReducer: PinnedHostReducerState;
    votingReducer: VotingReducerState;
};

export type ReduxStore = redux.Store & Reducers;

export const GlobalResetAction = () => ({
    type: "RESET",
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store: ReduxStore = redux.createStore(
    redux.combineReducers<Reducers>({
        chatMessageReducer,
        participantVideoReducer,
        pinnedHostReducer,
        votingReducer,
    }),
    composeEnhancers(),
);

export default store;
