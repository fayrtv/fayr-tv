// Framework
import { VideoTileState } from "amazon-chime-sdk-js";
// Functionality
import * as config from "config";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { replaceParticipantVideoRoster } from "redux/reducers/participantVideoReducer";
import { updatePinnedHost } from "redux/reducers/pinnedHostReducer";
import { ReduxStore } from "redux/store";
import { Nullable } from "types/global";

// Types
import { RosterMap, Attendee, Role } from "components/chime/ChimeSdkWrapper";

// Styles
import styles from "./CamSection.module.scss";

import { JoinInfo } from "../types";
// Components
import LocalVideo from "./LocalVideo/LocalVideo";
import ParticipantVideo from "./Participants/ParticipantVideo";
import ParticipantVideoGroup from "./Participants/ParticipantVideoGroup";
import { Roster } from "./types";

const MAX_REMOTE_VIDEOS = config.CHIME_ROOM_MAX_ATTENDEE;

type Props = {
    chime: any;
    joinInfo: JoinInfo;
};

export const CamSection = ({ chime, joinInfo }: Props) => {
    const [roster, setRoster] = React.useState<Roster>([]);
    const previousRoster = React.useRef<Roster>([]);

    const pinnedHostIdentifier = useSelector<ReduxStore, Nullable<string>>(
        (x) => x.pinnedHostReducer,
    );

    const dispatch = useDispatch();
    const setPinnedHostIdentifier = React.useCallback(
        (newHost) => {
            dispatch(updatePinnedHost(newHost));
        },
        [dispatch],
    );
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
                    videoEnabled: true,
                    attendeeId: tileState.boundAttendeeId,
                    tileId: tileState.tileId,
                } as Attendee;

                return newRoster;
            });
        },
        [findRosterSlot],
    );

    const videoTileWasRemovedCallback = React.useCallback((tileId: number) => {
        setRoster((currentRoster) => {
            // Find the removed tileId in the roster and mark the video as disabled.
            // eslint-disable-next-line
            const index = currentRoster.findIndex((o) => o.tileId === tileId);

            if (index === -1) {
                return currentRoster;
            }

            const newRoster = [...currentRoster];
            newRoster[index] = {} as Attendee;
            return newRoster;
        });

        if (config.DEBUG) {
            console.log(`Tile was removed ${tileId}`);
        }
    }, []);

    const onRosterUpdate = React.useCallback(
        (newRoster: RosterMap) => {
            if (Object.keys(newRoster).length < previousRoster.current.length) {
                if (config.DEBUG) {
                    console.log("Attendee(s) left");
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

                if (config.PinHost && !pinnedHostIdentifier && attendee.role === Role.Host) {
                    setPinnedHostIdentifier(attendee.attendeeId);
                }

                setRoster((currentRoster) => {
                    const newRoster = [...currentRoster];
                    newRoster[index] = attendee;
                    return newRoster;
                });
            }
        },
        [dispatch, roster, findRosterSlot, joinInfo.Attendee.AttendeeId, pinnedHostIdentifier],
    );

    React.useEffect(() => {
        const localRoster: Roster = [];
        previousRoster.current = storedRoster;

        const videoTiles = chime.audioVideo.videoTileController.getAllVideoTiles();

        for (let i = 0; i < MAX_REMOTE_VIDEOS; ++i) {
            localRoster[i] = storedRoster[i + 1] ?? ({} as Attendee);
            const boundTile = videoTiles.find(
                (x: any) => x.tileState.boundAttendeeId === localRoster[i].attendeeId,
            );

            if (boundTile) {
                localRoster[i].tileId = boundTile.tileState.tileId;
            }
        }

        setRoster(localRoster);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chime]);

    React.useEffect(() => {
        const audioVideo = chime.audioVideo;

        const observer = {
            videoTileDidUpdate: videoTileDidUpdateCallback,
            videoTileWasRemoved: videoTileWasRemovedCallback,
        };

        if (audioVideo) {
            audioVideo.addObserver(observer);
        }

        return () => {
            try {
                audioVideo.removeObserver(observer);
            } catch (ex) {
                // ok
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chime.audioVideo]);

    React.useEffect(() => {
        chime.subscribeToRosterUpdate(onRosterUpdate);

        return () => {
            chime.unsubscribeFromRosterUpdate(onRosterUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chime, onRosterUpdate]);

    const localVideo = (
        <LocalVideo
            key="LocalVideo"
            chime={chime}
            joinInfo={joinInfo}
            pin={setPinnedHostIdentifier}
        />
    );

    const participantVideos = React.useMemo(() => {
        const participantVideoMap = new Map<string, JSX.Element>();

        roster.forEach((attendee) => {
            participantVideoMap.set(
                attendee.attendeeId,
                <ParticipantVideo
                    chime={chime}
                    tileIndex={attendee.tileId}
                    key={attendee.attendeeId}
                    attendeeId={attendee.attendeeId}
                    videoEnabled={attendee.videoEnabled}
                    name={attendee.name}
                    muted={attendee.muted}
                    volume={attendee.volume}
                    pin={setPinnedHostIdentifier}
                />,
            );
        });

        return participantVideoMap;
    }, [roster, setPinnedHostIdentifier, chime]);

    const highlightVideo = (
        <div className={styles.HighlightVideoWrapper}>
            {!pinnedHostIdentifier ? localVideo : participantVideos.get(pinnedHostIdentifier!)}
        </div>
    );

    const participantVideo = (
        <div className={styles.ParticipantVideoWrapper}>
            <ParticipantVideoGroup
                key="ParticipantVideoGroup"
                participantVideos={participantVideos.values()}
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
