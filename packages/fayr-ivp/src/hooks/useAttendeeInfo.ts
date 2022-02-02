import * as config from "config";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Attendee } from "components/chime/ChimeSdkWrapper";

import {
    ReducerState as AttendeeMapState,
    addAttendee,
    putAttendee,
    updateAttendee,
    removeAttendee,
} from "../redux/reducers/attendeeReducer";
import { ReduxStore } from "../redux/store";

type AddAction = typeof addAttendee;
type UpdateAction = typeof updateAttendee;
type RemoveAction = typeof removeAttendee;
type PutAction = typeof putAttendee;

type AttendeeInfoData = {
    attendeeMap: AttendeeMapState;
    getAttendee: (id: string) => Attendee | undefined;
    addAttendee: AddAction;
    updateAttendee: UpdateAction;
    putAttendee: PutAction;
    removeAttendee: RemoveAction;
    removeAttendeeAtTile: (tileId: number) => void;
    removeAttendeeById: (id: string) => void;
};

export function useAttendeeInfo(): AttendeeInfoData {
    const attendeeMap = useSelector<ReduxStore, AttendeeMapState>((x) => x.attendeeReducer);

    const dispatch = useDispatch();

    const add: AddAction = React.useCallback((data) => dispatch(addAttendee(data)), [dispatch]);
    const update: UpdateAction = React.useCallback(
        (data) => dispatch(updateAttendee(data)),
        [dispatch],
    );
    const put: PutAction = React.useCallback((data) => dispatch(putAttendee(data)), [dispatch]);
    const remove: RemoveAction = React.useCallback(
        (data) => dispatch(removeAttendee(data)),
        [dispatch],
    );
    const removeById = React.useCallback(
        (id: string) =>
            remove({
                attendeeId: id,
            }),
        [remove],
    );

    const removeAtTile = React.useCallback(
        (tileId: number) => {
            const attendee = attendeeMap.find((x) => x.tileId === tileId);

            if (!attendee) {
                if (config.DEBUG) {
                    console.log(
                        `Tried to remove attendee with tile id ${tileId}, but could not find one.`,
                    );
                }
                return;
            }

            remove(attendee);
        },
        [remove, attendeeMap],
    );

    const getAttendee = React.useCallback(
        (id: string) => attendeeMap.find((x) => x.attendeeId === id),
        [attendeeMap],
    );

    return {
        attendeeMap,
        getAttendee,
        putAttendee: put,
        addAttendee: add,
        updateAttendee: update,
        removeAttendee: remove,
        removeAttendeeAtTile: removeAtTile,
        removeAttendeeById: removeById,
    };
}
