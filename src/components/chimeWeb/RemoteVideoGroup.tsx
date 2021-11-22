import React from "react";
import RemoteVideo from "./RemoteVideo";
import * as config from "../../config";

import { IChimeSdkWrapper, RosterMap, Attendee } from "../chime/ChimeSdkWrapper";
import { JoinInfo } from "./types";
import { VideoTileState } from "amazon-chime-sdk-js";
import { ReduxStore } from "../../redux/store";
import { connect, useDispatch } from "react-redux";
import { replaceRemoteVideoRoster } from "./../../redux/reducers/remoteVideoReducer";
import Cell from "components/common/GridLayout/Cell";
import Grid from "components/common/GridLayout/Grid";

const MAX_REMOTE_VIDEOS = config.CHIME_ROOM_MAX_ATTENDEE;

type Roster = Array<Attendee>;

type Props = {
    chime: IChimeSdkWrapper;
    joinInfo: JoinInfo;
    storedRoster: Roster;
};

export const RemoteVideoGroup = ({ chime, joinInfo, storedRoster }: Props) => {
    const [roster, setRoster] = React.useState<Roster>([]);
    const previousRoster = React.useRef<Roster>([]);
    const dispatch = useDispatch();

    const findRosterSlot = React.useCallback((attendeeId: string, localRoster: Roster) => {
        for (let index = 0; index < localRoster.length; index++) {
            if (localRoster[index].attendeeId === attendeeId || !localRoster[index].attendeeId) {
                return index;
            }
        }
        return localRoster.length;
    }, []);

    const videoTileDidUpdateCallback = React.useCallback(
        (tileState: VideoTileState) => {
            if (
                !tileState.boundAttendeeId ||
                tileState.localTile ||
                tileState.isContent ||
                !tileState.tileId
            ) {
                return;
            }

            setRoster((currentRoster) => {
                const newRoster = [...currentRoster];

                let index = findRosterSlot(tileState.boundAttendeeId!, newRoster);

                if (config.DEBUG) {
                    console.log(newRoster[index]);
                }

                const attendee =
                    newRoster[index] ??
                    previousRoster.current.find((x) => x.attendeeId === tileState.boundAttendeeId);

                newRoster[index] = {
                    ...attendee,
                    videoEnabled: tileState.active,
                    attendeeId: tileState.boundAttendeeId,
                    tileId: tileState.tileId,
                } as Attendee;

                return newRoster;
            });

            setTimeout(() => {
                const videoElement = document.getElementById(`video_${tileState.boundAttendeeId}`);

                if (videoElement) {
                    chime.audioVideo.bindVideoElement(
                        tileState.tileId!,
                        videoElement as HTMLVideoElement,
                    );
                }
            }, 1000);
        },
        [chime.audioVideo, findRosterSlot],
    );

    const videoTileWasRemovedCallback = React.useCallback(
        (tileId: number) => {
            // Find the removed tileId in the roster and mark the video as disabled.
            // eslint-disable-next-line
            const index = roster.findIndex((o) => o.tileId === tileId);

            if (index === -1) {
                return;
            }

            setRoster((currentRoster) => {
                const newRoster = [...currentRoster];
                newRoster[index].videoEnabled = false;
                return newRoster;
            });

            if (config.DEBUG) {
                console.log(`Tile was removed ${tileId}`);
            }
        },
        [roster],
    );

    const onRosterUpdate = React.useCallback(
        (newRoster: RosterMap) => {
            if (Object.keys(newRoster).length < previousRoster.current.length) {
                if (config.DEBUG) {
                    console.log("Attendee(s) left");
                }

                const differ = previousRoster.current.filter(
                    (_, k) => previousRoster.current[k] !== newRoster[k],
                );

                if (config.DEBUG) {
                    console.log(differ);
                }

                if (differ.length) {
                    for (let attendee of differ) {
                        const index = findRosterSlot(attendee.attendeeId, roster);

                        setRoster((currentRoster) => {
                            const newRoster = [...currentRoster];
                            newRoster[index] = {
                                ...roster[index],
                                videoElement: roster[index].videoElement,
                            } as Attendee;
                            return newRoster;
                        });
                    }
                }
            }

            previousRoster.current = Object.entries(newRoster).map(([attendeeId, attendee]) => ({
                ...attendee,
                attendeeId,
            }));

            dispatch(replaceRemoteVideoRoster(previousRoster.current));

            for (let attendeeId in newRoster) {
                // Exclude self & empty names
                if (attendeeId === joinInfo.Attendee.AttendeeId || !newRoster[attendeeId].name) {
                    continue;
                }

                const index = findRosterSlot(attendeeId, roster);

                const attendee = {
                    ...roster[index],
                    ...newRoster[attendeeId],
                    attendeeId: attendeeId,
                };

                setRoster((currentRoster) => {
                    const newRoster = [...currentRoster];
                    newRoster[index] = attendee;
                    return newRoster;
                });
            }
        },
        [dispatch, roster, findRosterSlot, joinInfo.Attendee.AttendeeId],
    );

    React.useEffect(() => {
        const localRoster: Roster = [];
        previousRoster.current = storedRoster;

        for (let i = 0; i < MAX_REMOTE_VIDEOS; ++i) {
            localRoster[i] =
                storedRoster[i + 1] ??
                ({
                    videoElement: React.createRef(),
                } as Attendee);
        }

        setRoster(localRoster);
    }, [chime]);

    React.useEffect(() => {
        chime.subscribeToRosterUpdate(onRosterUpdate);

        if (chime.audioVideo) {
            chime.audioVideo.addObserver({
                videoTileDidUpdate: videoTileDidUpdateCallback,
                videoTileWasRemoved: videoTileWasRemovedCallback,
            });
        }

        return () => {
            chime.unsubscribeFromRosterUpdate(onRosterUpdate);
            try {
                chime.audioVideo?.removeObserver({
                    videoTileDidUpdate: videoTileDidUpdateCallback,
                });
                chime.audioVideo?.removeObserver({
                    videoTileWasRemoved: videoTileWasRemovedCallback,
                });
            } catch (ex) {
                // ok
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        chime,
        onRosterUpdate,
        videoTileDidUpdateCallback,
        videoTileWasRemovedCallback,
        previousRoster.current,
    ]);

    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: "repeat(5, 1fr)",
                gridTemplateColumns: "repeat(2, 50%)",
            }}
            className="RemoteVideoGroup"
        >
            {roster.slice(0, 10).map((attendee, index) => {
                return (
                    <Cell key={index}>
                        <RemoteVideo
                            chime={chime}
                            tileIndex={index}
                            key={index}
                            attendeeId={attendee.attendeeId}
                            videoEnabled={attendee.videoEnabled}
                            name={attendee.name}
                            muted={attendee.muted}
                            volume={attendee.volume}
                            videoElement={attendee.videoElement}
                        />
                    </Cell>
                );
            })}
        </Grid>
    );
};

const mapStateToProps = (store: ReduxStore): Pick<Props, "storedRoster"> => ({
    storedRoster: store.remoteVideoReducer,
});

export default connect(mapStateToProps)(RemoteVideoGroup);
