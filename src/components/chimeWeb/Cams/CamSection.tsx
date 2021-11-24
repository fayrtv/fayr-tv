// Framework
import React from "react";
import { VideoTileState } from "amazon-chime-sdk-js";
import { useDispatch, useSelector } from "react-redux";

// Components
import LocalVideo from "./LocalVideo/LocalVideo";
import ParticipantVideoGroup from "./Participants/ParticipantVideoGroup";

// Functionality
import * as config from "config";
import { replaceParticipantVideoRoster } from "redux/reducers/participantVideoReducer";

// Types
import { RosterMap, Attendee } from "components/chime/ChimeSdkWrapper";
import { JoinInfo } from "../types";
import { Roster } from "./types";
import { ReduxStore } from "redux/store";
import { Nullable } from "types/global";

// Styles
import styles from "./CamSection.module.scss";
import ParticipantVideo from "./Participants/ParticipantVideo";

const MAX_REMOTE_VIDEOS = config.CHIME_ROOM_MAX_ATTENDEE;

type Props = {
    chime: any;
    joinInfo: JoinInfo;
};

export const CamSection = ({ chime, joinInfo }: Props) => {
    const [roster, setRoster] = React.useState<Roster>([]);
    const previousRoster = React.useRef<Roster>([]);

    const dispatch = useDispatch();
    const storedRoster = useSelector<ReduxStore, Roster>((x) => x.participantVideoReducer);

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

            dispatch(replaceParticipantVideoRoster(previousRoster.current));

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const [pinnedHostIdentifier, setPinnedHostIdentifier] = React.useState<Nullable<string>>(null);

    const localVideo = <LocalVideo key="LocalVideo" chime={chime} joinInfo={joinInfo} />;

    const grabPinnedRemoteVideo = (id: string) => {
        const rosterElementIndex = roster.findIndex((x) => x.attendeeId === id);

        if (rosterElementIndex === -1) {
            return null;
        }

        const rosterElement = roster[rosterElementIndex];

        return (
            <ParticipantVideo
                muted={rosterElement.muted}
                attendeeId={id}
                videoEnabled={rosterElement.videoEnabled}
                name={rosterElement.name}
                videoElement={rosterElement.videoElement}
                chime={chime}
                tileIndex={rosterElementIndex}
                volume={rosterElement.volume}
                pin={(_) => void 0}
            />
        );
    };

    const highlightVideo = (
        <div className={styles.HighlightVideoWrapper}>
            {!pinnedHostIdentifier ? localVideo : grabPinnedRemoteVideo(pinnedHostIdentifier!)}
        </div>
    );

    const participantVideo = (
        <div className={styles.ParticipantVideoWrapper}>
            <ParticipantVideoGroup
                key="ParticipantVideoGroup"
                chime={chime}
                roster={roster}
                localVideoInfo={
                    !pinnedHostIdentifier
                        ? {
                              node: null,
                              replace: false,
                              tile: 0,
                          }
                        : {
                              node: localVideo,
                              replace: true,
                              tile: roster.findIndex((x) => x.attendeeId === pinnedHostIdentifier),
                          }
                }
                pin={setPinnedHostIdentifier}
            />
        </div>
    );

    return (
        <div className={styles.CamSection}>
            {config.HighlightVideoAlignment === "Top" ? (
                <>
                    {highlightVideo}
                    {participantVideo}
                </>
            ) : (
                <>
                    {participantVideo}
                    {highlightVideo}
                </>
            )}
        </div>
    );
};

export default CamSection;
