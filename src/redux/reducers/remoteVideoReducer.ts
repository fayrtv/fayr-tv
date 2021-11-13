import { ReducerAction } from "../types";
import { Attendee } from "../../components/chime/ChimeSdkWrapper";

const REMOTEVIDEOROSTER_UPDATED = "REMOTEVIDEOROSTER_UPDATED";

type RemoteVideoAction = ReducerAction<Array<Attendee>>;

const generateAction =
    (type: string) =>
    (payload: Array<Attendee>): RemoteVideoAction => ({
        type,
        payload,
    });

export const replaceRemoteVideoRoster = generateAction(REMOTEVIDEOROSTER_UPDATED);

export type RemoteVideoReducerState = Array<Attendee>;

const initialState: RemoteVideoReducerState = [];

export const reducer = (
    state = initialState,
    action: ReducerAction<Array<Attendee>>,
): RemoteVideoReducerState => {
    switch (action.type) {
        case REMOTEVIDEOROSTER_UPDATED:
            return action.payload;
        case "RESET":
            return [];
        default:
            return state;
    }
};
