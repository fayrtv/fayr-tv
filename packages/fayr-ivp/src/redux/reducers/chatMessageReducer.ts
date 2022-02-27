import { CouldBeArray, ensureArray } from "util/collectionUtil";

import { Message } from "components/chat/types";

import { ReducerAction } from "../types";

const CHAT_ADD_MESSAGE = "CHAT_ADD_MESSAGE"; // Idempotent
const CHAT_MARK_MESSAGE_AS_SEEN = "CHAT_MARK_MESSAGE_AS_SEEN";

type MessageAction = ReducerAction<CouldBeArray<Message>>;

const generateAction =
    (type: string) =>
    (payload: CouldBeArray<Message>): MessageAction => ({
        type,
        payload,
    });

export const addMessage = generateAction(CHAT_ADD_MESSAGE);

export const markAsSeen = generateAction(CHAT_MARK_MESSAGE_AS_SEEN);

export type ChatMessageReducerState = Array<Message>;

const initialState: ChatMessageReducerState = [];

export const reducer = (
    state = initialState,
    action: ReducerAction<Message>,
): ChatMessageReducerState => {
    const payloadArray = ensureArray(action.payload);

    switch (action.type) {
        case CHAT_ADD_MESSAGE:
            if (state.find((m) => payloadArray.find((x) => x.id === m.id))) {
                // The same message has already been added
                return state;
            }
            return state.concat(payloadArray);
        case CHAT_MARK_MESSAGE_AS_SEEN:
            const newState = [...state];
            payloadArray.forEach((x) => {
                const existingMessage = newState.find(
                    (y) => x.username === y.username && x.timestamp === y.timestamp,
                );
                if (!!existingMessage) {
                    existingMessage.seen = true;
                }
            });
            return newState;
        case "RESET":
            return [];
        default:
            return state;
    }
};
