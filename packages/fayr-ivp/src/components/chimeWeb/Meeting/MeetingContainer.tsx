import { MeetingSessionStatusCode } from "amazon-chime-sdk-js";
import AudioVideoObserver from "amazon-chime-sdk-js/build/audiovideoobserver/AudioVideoObserver";
import * as config from "config";
import { useInjection } from "inversify-react";
import React from "react";
import { Redirect, RouteComponentProps, useRouteMatch, withRouter } from "react-router-dom";
import Types from "types/inject";
import { getPropertyCaseInsensitive } from "util/objectUtil";

import useLoadingGuard from "hooks/useLoadingGuard";

import IRoomManager from "components/chime/interfaces/IRoomManager";
import Meeting from "components/chimeWeb/Meeting/Meeting";
import { MeetingMetaData, MeetingStatus } from "components/chimeWeb/Meeting/meetingTypes";
import { JoinInfo } from "components/chimeWeb/types";

import { LoadingAnimation, isFalsyOrWhitespace } from "@fayr/common";

import useMeetingMetaData from "../../../hooks/useMeetingMetaData";
import IAudioVideoManager from "../../chime/interfaces/IAudioVideoManager";
import MeetingStartScreen from "./MeetingStartScreen";
import { formatMeetingSsKey } from "./storage";

type PublicProps = {
    roomTitle: string;
};

export const MeetingContainer = ({
    roomTitle,
    history,
}: PublicProps & { history: RouteComponentProps["history"] }) => {
    const { url } = useRouteMatch();

    const audioElementRef = React.createRef<HTMLAudioElement>();

    const roomManager = useInjection<IRoomManager>(Types.IRoomManager);
    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    // Will be undefined on direct URL loading without previously filling meeting fields
    const [meetingMetaData, setMeetingMetaData] = useMeetingMetaData(() => {
        const rawData = localStorage.getItem(formatMeetingSsKey(roomTitle));
        if (!rawData || isFalsyOrWhitespace(rawData)) {
            return {} as MeetingMetaData;
        }

        try {
            return {
                ...(JSON.parse(rawData) as MeetingMetaData),
                muted: true,
                videoEnabled: false,
            };
        } catch (error) {
            return {} as MeetingMetaData;
        }
    });

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
                await roomManager.reInitializeMeetingSession(
                    meetingMetaData.joinInfo,
                    meetingMetaData.userName,
                );

                if (meetingMetaData.meetingInputOutputDevices) {
                    const promises: Array<Promise<void>> = [];

                    if (meetingMetaData.meetingInputOutputDevices) {
                        const { audioInput, audioOutput, cam } =
                            meetingMetaData.meetingInputOutputDevices;

                        if (audioInput && !meetingMetaData.muted && !meetingMetaData.forceMuted) {
                            promises.push(
                                (async () => {
                                    await audioVideoManager.setAudioInputDeviceSafe(audioInput);
                                    audioVideoManager.audioVideo!.start();
                                })(),
                            );
                        }

                        if (audioOutput) {
                            promises.push(audioVideoManager.setAudioOutputDeviceSafe(audioOutput));
                        }

                        if (
                            cam &&
                            meetingMetaData.videoEnabled &&
                            !meetingMetaData.forceVideoDisabled
                        ) {
                            promises.push(
                                (async () => {
                                    await audioVideoManager.setVideoInputDeviceSafe(cam);
                                    audioVideoManager.audioVideo.start();
                                    audioVideoManager.audioVideo.startLocalVideoTile();
                                })(),
                            );
                        }
                    }

                    await Promise.all(promises);
                }
            } else {
                const [role, userName, title, playbackUrl] = [
                    getPropertyCaseInsensitive(meetingMetaData, "role")!,
                    getPropertyCaseInsensitive(meetingMetaData, "userName")!,
                    getPropertyCaseInsensitive(meetingMetaData, "title")!,
                    getPropertyCaseInsensitive(meetingMetaData, "playbackURL"),
                ];
                const joinInfo: JoinInfo = await roomManager.createRoom(
                    role,
                    userName,
                    title,
                    playbackUrl,
                );
                setMeetingMetaData({
                    joinInfo,
                    playbackURL: joinInfo.PlaybackURL,
                    title: joinInfo.Title,
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [roomManager, audioVideoManager.audioVideo],
    );
    const { isLoading } = useLoadingGuard(true, initializeSession);

    React.useEffect(() => {
        if (meetingStatus === "Success" || meetingStatus === "Loading") {
            return;
        }

        if (audioElementRef.current) {
            setMeetingStatus("Loading");
            roomManager.joinRoom(audioElementRef.current).then(() => {
                setMeetingStatus("Success");
            });
        }
    }, [roomManager, audioElementRef, meetingStatus]);

    // TODO: Retry this once this is available in all browsers (LOOKING AT YOU SAFARI)
    // React.useEffect(() => {
    //     const permissionWatcher = new PermissionDeviceWatcher(chime);
    //     permissionWatcher.start();
    //     return () => permissionWatcher.stop();
    // }, [chime]);

    React.useEffect(() => {
        // Perform cleanup
        return () => {
            roomManager.leaveRoom(meetingMetaData?.role === "host").then((_) => {
                if (config.DEBUG) {
                    console.debug("Left room");
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!meetingMetaData || !audioVideoManager.audioVideo) {
            return;
        }

        const observer: AudioVideoObserver = {
            audioVideoDidStop: async (sessionStatus) => {
                if (sessionStatus.statusCode() === MeetingSessionStatusCode.AudioCallEnded) {
                    const whereTo = `${config.BASE_HREF}/${
                        meetingMetaData.role === "host" ? "" : "end"
                    }`;
                    // noinspection ES6MissingAwait
                    roomManager.leaveRoom(meetingMetaData.role === "host");
                    history.push(whereTo);
                }
            },
        };
        audioVideoManager.audioVideo.addObserver(observer);
        return () => audioVideoManager.audioVideo?.removeObserver(observer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomTitle, meetingMetaData?.role, audioVideoManager.audioVideo, roomManager, history]);

    return isLoading || !meetingMetaData.joinInfo ? (
        <LoadingAnimation fullScreen={true} />
    ) : meetingMetaData && roomTitle ? (
        showStartScreen ? (
            <MeetingStartScreen
                attendeeId={roomManager.attendeeId}
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
            />
        ) : (
            <>
                <audio ref={audioElementRef} style={{ display: "none" }} />
                <Meeting
                    {...meetingMetaData}
                    roomTitle={roomTitle}
                    meetingStatus={meetingStatus}
                    setMeetingStatus={setMeetingStatus}
                    joinInfo={meetingMetaData.joinInfo!}
                />
            </>
        )
    ) : (
        <Redirect to={`${url}/`} />
    );
};

const MeetingRouter = ({
    location,
    history,
}: Omit<RouteComponentProps & PublicProps, "roomTitle">) => {
    const { url } = useRouteMatch();

    const roomTitle = React.useMemo<string | null>(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get("room");
    }, [location.search]);

    return roomTitle ? (
        <MeetingContainer roomTitle={roomTitle} history={history} />
    ) : (
        <Redirect to={`${url}/`} />
    );
};

export default withRouter(MeetingRouter);
