// Framework
import * as redux from "redux";

// Functionality
import { reducer as chatMessageReducer, ChatMessageReducerState } from "redux/reducers/chatMessageReducer";

export type Reducers = {
	chatMessageReducer: ChatMessageReducerState;
}

export type ReduxStore = redux.Store & Reducers

export const store: ReduxStore = redux.createStore(
	redux.combineReducers<Reducers>({
		chatMessageReducer,
	}),
);

export default store;