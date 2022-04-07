import { GLOBAL_RESET } from "redux/store";
import { PartialBut } from "types/global";

import { Attendee } from "components/chime/types";

import { ReducerAction } from "../types";

const ADD_ATTENDEE = "ADD_ATTENDEE";
const UPDATE_ATTENDEE = "UPDATE_ATTENDEE";
const PUT_ATTENDEE = "PUT_ATTENDEE";
const REMOVE_ATTENDEE = "REMOVE_ATTENDEE";

export type ReducerState = Array<Attendee>;

type MinimalAttendee = PartialBut<Attendee, "attendeeId">;

type CouldBeMinimalAttendee = Attendee | MinimalAttendee;

type AttendeeReducerAction = ReducerAction<CouldBeMinimalAttendee>;

const generateAction =
    <TPayload extends CouldBeMinimalAttendee>(type: string) =>
    (data: TPayload): AttendeeReducerAction => ({
        payload: data,
        type,
    });

export const addAttendee = generateAction<Attendee>(ADD_ATTENDEE);
export const updateAttendee = generateAction<MinimalAttendee>(UPDATE_ATTENDEE);
export const putAttendee = generateAction<CouldBeMinimalAttendee>(PUT_ATTENDEE);
export const removeAttendee = generateAction<MinimalAttendee>(REMOVE_ATTENDEE);

const initialState: ReducerState = [];

export const reducer = (state = initialState, action: AttendeeReducerAction): ReducerState => {
    switch (action.type) {
        case ADD_ATTENDEE:
            return [...state, action.payload as Attendee];
        case UPDATE_ATTENDEE:
            const attendeeIndex = state.findIndex(
                (x) => x.attendeeId === action.payload.attendeeId,
            );

            if (attendeeIndex === -1) {
                return state;
            }

            const stateAfterUpdate = [...state];
            stateAfterUpdate[attendeeIndex] = {
                ...stateAfterUpdate[attendeeIndex],
                ...action.payload,
            };
            return stateAfterUpdate;
        case PUT_ATTENDEE:
            const stateAfterPut = [...state];
            const knownIndex = state.findIndex((x) => x.attendeeId === action.payload.attendeeId);

            if (knownIndex === -1) {
                stateAfterPut.push(action.payload as Attendee);
            } else {
                stateAfterPut[knownIndex] = {
                    ...stateAfterPut[knownIndex],
                    ...action.payload,
                };
            }
            return stateAfterPut;
        case REMOVE_ATTENDEE:
            return state.filter((x) => x.attendeeId !== action.payload.attendeeId);
        case GLOBAL_RESET:
            return [];
        default:
            return state;
    }
};
