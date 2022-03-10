// Framework
import { VideoTileState } from "amazon-chime-sdk-js";
// Functionality
import * as config from "config";
import React from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { updatePinnedHost } from "redux/reducers/pinnedHostReducer";
import { ReduxStore } from "redux/store";
import { Nullable } from "types/global";

import useSocket from "hooks/useSocket";

// Types
import {
    RosterMap,
    Role,
    IChimeAudioVideoProvider,
    IChimeDevicePicker,
} from "components/chime/ChimeSdkWrapper";
import { SocketEventType } from "components/chime/types";

// Styles
import styles from "./CamSection.module.scss";

import { useAttendeeInfo } from "../../../hooks/useAttendeeInfo";
import useMeetingMetaData from "../../../hooks/useMeetingMetaData";
import { IChimeSdkWrapper } from "../../chime/ChimeSdkWrapper";
import { JoinInfo, ForceMicChangeDto, ForceCamChangeDto } from "../types";
// Components
import LocalVideo from "./LocalVideo/LocalVideo";
import ParticipantVideo from "./Participants/ParticipantVideo";
import ParticipantVideoGroup from "./Participants/ParticipantVideoGroup";
import { ActivityState, ActivityStateChangeDto } from "./types";

type Props = {
    chime: IChimeSdkWrapper & IChimeAudioVideoProvider & IChimeDevicePicker;
    joinInfo: JoinInfo;
};

export const CamSection = ({ chime, joinInfo }: Props) => {
    const {
        attendeeMap,
        updateAttendee,
        putAttendee,
        getAttendee,
        removeAttendeeAtTile,
        removeAttendee,
    } = useAttendeeInfo();

    const [{ role, muted, videoEnabled }, setMetaData] = useMeetingMetaData();

    const pinnedHostIdentifier = useSelector<ReduxStore, Nullable<string>>(
        (x) => x.pinnedHostReducer,
    );

    const { socket } = useSocket();

    const dispatch = useDispatch();
    const setPinnedHostIdentifier = React.useCallback(
        (newHost) => {
            dispatch(updatePinnedHost(newHost));
        },
        [dispatch],
    );

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

            putAttendee({
                videoEnabled: tileState.active,
                attendeeId: tileState.boundAttendeeId,
                tileId: tileState.tileId,
                activityState: ActivityState.Available,
            });
        },
        [putAttendee],
    );

    const onVideoTileRemoved = React.useCallback(
        (tileId: number) => {
            removeAttendeeAtTile(tileId);

            if (config.DEBUG) {
                console.log(`Tile was removed ${tileId}`);
            }
        },
        [removeAttendeeAtTile],
    );

    const onRosterUpdate = React.useCallback(
        (roster: RosterMap) => {
            if (config.DEBUG) {
                if (Object.keys(roster).length < attendeeMap.length) {
                    console.log("Attendee(s) left");
                }
            }

            const remainingIds = new Set<string>();
            for (let attendeeId in roster) {
                // Exclude self (We are not part of the participants, but have our local video)
                // and empty names (These are likely not valid participants, since entering a session requires setting a non-empty name)
                if (attendeeId === joinInfo.Attendee.AttendeeId) {
                    continue;
                }

                remainingIds.add(attendeeId);

                if (!roster[attendeeId].name) {
                    continue;
                }

                if (
                    config.HostPinningFeatureEnabled &&
                    !pinnedHostIdentifier &&
                    roster[attendeeId].role === Role.Host
                ) {
                    setPinnedHostIdentifier(attendeeId);
                }

                putAttendee({
                    ...roster[attendeeId],
                    attendeeId: attendeeId,
                });
            }

            batch(() => {
                for (const removedAttendee of attendeeMap.filter(
                    (x) => !remainingIds.has(x.attendeeId),
                )) {
                    removeAttendee(removedAttendee);
                }
            });
        },
        [
            removeAttendee,
            putAttendee,
            attendeeMap,
            joinInfo.Attendee.AttendeeId,
            pinnedHostIdentifier,
            setPinnedHostIdentifier,
        ],
    );

    React.useEffect(() => {
        const audioVideo = chime.audioVideo;

        const observer = {
            videoTileDidUpdate: videoTileDidUpdateCallback,
            videoTileWasRemoved: onVideoTileRemoved,
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

    const isSelfHost = role === "host";

    const onMicClicked = React.useCallback(
        (attendeeId: string) => {
            // We need to be the host to be allowed to enable / disable mics, and we shouldn't be able to force mute the host while being the host ourselves
            if (!isSelfHost || attendeeId === joinInfo.Attendee.AttendeeId) {
                return;
            }

            socket?.send<ForceMicChangeDto>({
                messageType: SocketEventType.ForceAttendeeMicChange,
                payload: {
                    attendeeId,
                    isForceMuted: !getAttendee(attendeeId)?.forceMuted ?? true,
                },
            });
        },
        [isSelfHost, joinInfo.Attendee.AttendeeId, getAttendee, socket],
    );

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        const micChangeDispose = socket.addListener<ForceMicChangeDto>(
            SocketEventType.ForceAttendeeMicChange,
            ({ attendeeId, isForceMuted: forceMuted }) => {
                if (attendeeId === joinInfo.Attendee.AttendeeId) {
                    setMetaData({
                        forceMuted,
                    });

                    if (forceMuted) {
                        chime.audioVideo.realtimeMuteLocalAudio();
                    } else {
                        // Only unmute if we didn't mute ourself locally
                        chime.audioVideo.realtimeUnmuteLocalAudio();
                    }

                    return Promise.resolve();
                }

                updateAttendee({
                    attendeeId,
                    forceMuted,
                });

                return Promise.resolve();
            },
        );

        const camChangeDispose = socket.addListener<ForceCamChangeDto>(
            SocketEventType.ForceAttendeeVideoChange,
            async ({ attendeeId, forceVideoDisabled }) => {
                if (attendeeId === joinInfo.Attendee.AttendeeId) {
                    setMetaData({
                        forceVideoDisabled,
                    });

                    if (forceVideoDisabled) {
                        chime.audioVideo.stopLocalVideoTile();
                    } else {
                        await chime.chooseVideoInputDevice(chime.currentVideoInputDevice);
                        // Only unmute if we didn't mute ourself locally
                        chime.audioVideo.startLocalVideoTile();
                    }

                    return Promise.resolve();
                }

                updateAttendee({
                    attendeeId,
                    forceVideoDisabled,
                });

                return Promise.resolve();
            },
        );

        const activityChangeDispose = socket.addListener<ActivityStateChangeDto>(
            SocketEventType.ActivityStateChange,
            async ({ activityState, attendeeId }) => {
                if (attendeeId === joinInfo.Attendee.AttendeeId) {
                    return;
                }

                updateAttendee({
                    attendeeId,
                    activityState,
                });
            },
        );

        return () => {
            micChangeDispose();
            camChangeDispose();
            activityChangeDispose();
        };
    }, [
        socket,
        updateAttendee,
        setMetaData,
        joinInfo.Attendee.AttendeeId,
        chime,
        muted,
        videoEnabled,
    ]);

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

        attendeeMap.forEach((attendee) => {
            participantVideoMap.set(
                attendee.attendeeId,
                <ParticipantVideo
                    isSelfHost={isSelfHost}
                    onMicClick={onMicClicked}
                    chime={chime}
                    tileIndex={attendee.tileId}
                    key={attendee.attendeeId}
                    forceMuted={attendee.forceMuted}
                    forceVideoDisabled={attendee.forceVideoDisabled}
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
    }, [attendeeMap, setPinnedHostIdentifier, chime, isSelfHost, onMicClicked]);

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
                              tile: attendeeMap.findIndex(
                                  (x) => x.attendeeId === pinnedHostIdentifier,
                              ),
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
