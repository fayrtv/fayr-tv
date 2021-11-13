// Framework
import * as redux from "redux";

// Functionality
import {
    reducer as chatMessageReducer,
    ChatMessageReducerState,
} from "redux/reducers/chatMessageReducer";
import {
    reducer as remoteVideoReducer,
    RemoteVideoReducerState,
} from "redux/reducers/remoteVideoReducer";
import { reducer as votingReducer, VotingReducerState } from "redux/reducers/votingReducer";

export type Reducers = {
    chatMessageReducer: ChatMessageReducerState;
    remoteVideoReducer: RemoteVideoReducerState;
    votingReducer: VotingReducerState;
};

export type ReduxStore = redux.Store & Reducers;

export const GlobalResetAction = () => ({
    type: "RESET",
});

export const store: ReduxStore = redux.createStore(
    redux.combineReducers<Reducers>({
        chatMessageReducer,
        remoteVideoReducer,
        votingReducer,
    }),
);

export default store;
