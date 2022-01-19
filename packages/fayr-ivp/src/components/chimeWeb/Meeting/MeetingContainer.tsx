import { MeetingSessionStatusCode } from "amazon-chime-sdk-js";
import AudioVideoObserver from "amazon-chime-sdk-js/build/audiovideoobserver/AudioVideoObserver";
import * as config from "config";
import React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";

import useLoadingGuard from "hooks/useLoadingGuard";
import { usePersistedState } from "hooks/usePersistedState";

import ChimeSdkWrapper from "components/chime/ChimeSdkWrapper";
import Meeting from "components/chimeWeb/Meeting/Meeting";
import { MeetingStatus, MeetingMetaData } from "components/chimeWeb/Meeting/meetingTypes";
import { formatMeetingSsKey } from "components/chimeWeb/Meeting/storage";
import { JoinInfo } from "components/chimeWeb/types";

import { LoadingAnimation } from "@fayr/shared-components";

import MeetingStartScreen from "./MeetingStartScreen";

type PublicProps = {
    chime: ChimeSdkWrapper;
    roomTitle: string;
};

export const MeetingContainer = ({
    chime,
    roomTitle,
    history,
}: PublicProps & { history: RouteComponentProps["history"] }) => {
    const audioElementRef = React.createRef<HTMLAudioElement>();
    // const myVideoElement = React.createRef<HTMLVideoElement>();

    // Will be undefined on direct URL loading without previously filling meeting fields
    const [meetingMetaData, setMeetingMetaData] = usePersistedState<MeetingMetaData | undefined>(
        formatMeetingSsKey(roomTitle),
    );

    // Loading, Success or Failed
    const [meetingStatus, setMeetingStatus] = React.useState<MeetingStatus | null>(null);

    const [showStartScreen, setShowStartScreen] = React.useState(
        config.ShowStartScreen && !meetingMetaData?.meetingInputOutputDevices,
    );

    const initializeSession = React.useCallback(
        async () => {
            if (!meetingMetaData) {
                return;
            }
            if (meetingMetaData.joinInfo) {
                // Browser refresh
                await chime.reInitializeMeetingSession(
                    meetingMetaData.joinInfo,
                    meetingMetaData.username,
                );

                if (meetingMetaData.meetingInputOutputDevices) {
                    const promises: Array<Promise<void>> = [];

                    if (meetingMetaData.meetingInputOutputDevices) {
                        const { audioInput, audioOutput, cam } =
                            meetingMetaData.meetingInputOutputDevices;

                        if (audioInput) {
                            promises.push(chime.chooseAudioInputDevice(audioInput));
                        }

                        if (audioOutput) {
                            promises.push(chime.chooseAudioOutputDevice(audioOutput));
                        }

                        if (cam) {
                            promises.push(
                                (async () => {
                                    await chime.chooseVideoInputDevice(cam);
                                    chime.audioVideo.start();
                                    chime.audioVideo.startLocalVideoTile();
                                })(),
                            );
                        }
                    }

                    await Promise.all(promises);
                }
            } else {
                const joinInfo: JoinInfo = await chime.createRoom(
                    meetingMetaData.role,
                    meetingMetaData.username,
                    meetingMetaData.title,
                    meetingMetaData.playbackURL,
                );
                setMeetingMetaData((current) => ({
                    ...current!,
                    joinInfo,
                    playbackURL: joinInfo.PlaybackURL,
                    title: joinInfo.Title,
                }));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chime],
    );
    const { isLoading } = useLoadingGuard(true, initializeSession);

    React.useEffect(() => {
        if (meetingStatus === "Success" || meetingStatus === "Loading") {
            return;
        }

        if (audioElementRef.current) {
            setMeetingStatus("Loading");
            chime.joinRoom(audioElementRef.current).then(() => {
                setMeetingStatus("Success");
            });
        }
    }, [chime, audioElementRef, meetingStatus]);

    // TODO: Retry this once this is available in all browsers (LOOKING AT YOU SAFARI)
    // React.useEffect(() => {
    //     const permissionWatcher = new PermissionDeviceWatcher(chime);
    //     permissionWatcher.start();
    //     return () => permissionWatcher.stop();
    // }, [chime]);

    React.useEffect(() => {
        // Perform cleanup
        return () => {
            chime.leaveRoom(meetingMetaData?.role === "host").then((_) => {
                if (config.DEBUG) {
                    console.debug("Left room");
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!meetingMetaData || !chime.audioVideo) {
            return;
        }

        const observer: AudioVideoObserver = {
            audioVideoDidStop: async (sessionStatus) => {
                if (sessionStatus.statusCode() === MeetingSessionStatusCode.AudioCallEnded) {
                    const whereTo = `${config.BASE_HREF}/${
                        meetingMetaData.role === "host" ? "" : "end"
                    }`;
                    // noinspection ES6MissingAwait
                    chime.leaveRoom(meetingMetaData.role === "host");
                    history.push(whereTo);
                }
            },
        };
        chime.audioVideo.addObserver(observer);
        return () => chime.audioVideo?.removeObserver(observer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomTitle, meetingMetaData?.role, chime, history]);

    return isLoading ? (
        <LoadingAnimation fullScreen={true} />
    ) : meetingMetaData && roomTitle ? (
        showStartScreen ? (
            <MeetingStartScreen
                updateMeetingInputOutputDevices={(partialInputOutputDeviceState) => {
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            ...partialInputOutputDeviceState,
                        },
                    });
                }}
                audioVideo={chime.audioVideo}
                attendeeId={chime.attendeeId}
                onContinue={() => {
                    setShowStartScreen(false);
                    if (!meetingMetaData.meetingInputOutputDevices) {
                        setMeetingMetaData({
                            ...meetingMetaData,
                            meetingInputOutputDevices:
                                meetingMetaData.meetingInputOutputDevices ?? {},
                        });
                    }
                }}
                chime={chime}
            />
        ) : (
            <>
                <audio ref={audioElementRef} style={{ display: "none" }} />
                <Meeting
                    chime={chime}
                    roomTitle={roomTitle}
                    meetingStatus={meetingStatus}
                    setMeetingStatus={setMeetingStatus}
                    joinInfo={meetingMetaData.joinInfo!}
                    role={meetingMetaData.role}
                    title={meetingMetaData.title}
                    username={meetingMetaData.username}
                    playbackURL={meetingMetaData.playbackURL}
                />
            </>
        )
    ) : (
        <Redirect to={`${config.BASE_HREF}/`} />
    );
};

const MeetingRouter = ({
    location,
    history,
    chime,
}: Omit<RouteComponentProps & PublicProps, "roomTitle">) => {
    const roomTitle = React.useMemo<string | null>(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get("room");
    }, [location.search]);

    return roomTitle ? (
        <MeetingContainer chime={chime} roomTitle={roomTitle} history={history} />
    ) : (
        <Redirect to={`${config.BASE_HREF}/`} />
    );
};

export default withRouter(MeetingRouter);
