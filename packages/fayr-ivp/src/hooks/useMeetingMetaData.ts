import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { MeetingMetaData } from "components/chimeWeb/Meeting/meetingTypes";

import { updateMeetingState } from "../redux/reducers/meetingStateReducer";
import { ReduxStore } from "../redux/store";

export default function useMeetingMetaData(
    initializer?: () => MeetingMetaData,
): [MeetingMetaData, (metaData: Partial<MeetingMetaData>) => void] {
    const dispatch = useDispatch();
    const metaData = useSelector<ReduxStore, MeetingMetaData>((x) => x.meetingStateReducer);

    const updateMetaData = (partialNewMeta: Partial<MeetingMetaData>) => {
        dispatch(
            updateMeetingState({
                ...metaData,
                ...partialNewMeta,
            }),
        );
    };

    React.useEffect(() => {
        if (initializer) {
            updateMetaData(initializer());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (initializer && Object.keys(metaData).length === 0) {
        return [initializer(), updateMetaData];
    }

    return [metaData, updateMetaData];
}
