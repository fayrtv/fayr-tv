import { ReducerAction } from "../types";
import { Message } from "components/chat/types";
import { CouldBeArray, ensureArray } from "util/collectionUtil";

const CHAT_ADD_MESSAGE = "CHAT_ADD_MESSAGE";
const CHAT_MARK_MESSAGE_AS_SEEN = "CHAT_MARK_MESSAGE_AS_SEEN";

type MessageAction = ReducerAction<CouldBeArray<Message>>;

const generateAction = (type: string) => (payload: CouldBeArray<Message>): MessageAction => ({
	type,
	payload,
});

export const addMessage = generateAction(CHAT_ADD_MESSAGE);

export const markAsSeen = generateAction(CHAT_MARK_MESSAGE_AS_SEEN);

export type ChatMessageReducerState = Array<Message>;

const initialState: ChatMessageReducerState = [];

export const reducer = (state = initialState, action: ReducerAction<Message>): ChatMessageReducerState => {

	const payloadArray = ensureArray(action.payload);

	switch (action.type) {
		case CHAT_ADD_MESSAGE:
			return state.concat(payloadArray);
		case CHAT_MARK_MESSAGE_AS_SEEN:
			const newState = [...state];
			payloadArray.forEach(x => {
				const existingMessage = newState.find(y => x.username === y.username && x.timestamp === y.timestamp);
				if (!!existingMessage) {
					existingMessage.seen = true;
				}
			});
			return newState;
		default:
			return state;
	}
}