import { put, takeEvery } from "redux-saga/effects";

import { formatMeetingSsKey } from "components/chimeWeb/Meeting/storage";

import { MeetingMetaData } from "../../components/chimeWeb/Meeting/meetingTypes";
import { ReducerAction } from "../types";

const UPDATE_MEETING_STATE = "UPDATE_MEETING_STATE";
const UPDATE_MEETING_STATE_SUCCEEDED = "UPDATE_MEETING_STATE_SUCCEEDED";

type MeetingStateAction = ReducerAction<MeetingMetaData>;

export const updateMeetingState = (meetingMetaData: MeetingMetaData): MeetingStateAction => ({
    type: UPDATE_MEETING_STATE,
    payload: meetingMetaData,
});

const initialState: MeetingMetaData = {} as MeetingMetaData;

export const reducer = (state = initialState, action: MeetingStateAction): MeetingMetaData => {
    switch (action.type) {
        case UPDATE_MEETING_STATE_SUCCEEDED:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export function* meetingStateReducerSaga() {
    yield takeEvery(UPDATE_MEETING_STATE, updateMeetingStateAction);
}

function* updateMeetingStateAction(action: MeetingStateAction) {
    try {
        const key = formatMeetingSsKey(action.payload.title!);
        sessionStorage.setItem(key, JSON.stringify(action.payload));
        yield put({
            ...action,
            type: UPDATE_MEETING_STATE_SUCCEEDED,
        });
    } catch {
        // Something failed, don't forward to the state
        yield;
    }
}
