import { Attendee } from "../../components/chime/ChimeSdkWrapper";
import { ReducerAction } from "../types";

const PARTICIPANT_VIDEOROSTER_UPDATED = "PARTICIPANT_VIDEOROSTER_UPDATED";

type ParticipantVideoAction = ReducerAction<Array<Attendee>>;

const generateAction =
    (type: string) =>
    (payload: Array<Attendee>): ParticipantVideoAction => ({
        type,
        payload,
    });

export const replaceParticipantVideoRoster = generateAction(PARTICIPANT_VIDEOROSTER_UPDATED);

export type ParticipantVideoReducerState = Array<Attendee>;

const initialState: ParticipantVideoReducerState = [];

export const reducer = (
    state = initialState,
    action: ReducerAction<Array<Attendee>>,
): ParticipantVideoReducerState => {
    switch (action.type) {
        case PARTICIPANT_VIDEOROSTER_UPDATED:
            return action.payload;
        case "RESET":
            return [];
        default:
            return state;
    }
};
