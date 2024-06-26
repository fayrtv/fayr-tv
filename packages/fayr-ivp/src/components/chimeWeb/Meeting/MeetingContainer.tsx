import { MeetingSessionStatusCode } from "amazon-chime-sdk-js";
import AudioVideoObserver from "amazon-chime-sdk-js/build/audiovideoobserver/AudioVideoObserver";
import * as config from "config";
import { useInjection } from "inversify-react";
import React, { useState } from "react";
import { Redirect, RouteComponentProps, useRouteMatch, withRouter } from "react-router-dom";
import styled from "styled-components";
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
import SettingsView from "./Settings/SettingsView";
import { formatMeetingSsKey } from "./storage";

const ErrorFullScreen = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 999;
    height: 2em;
    width: 100%;
    text-align: center;
    overflow: unset;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    // Transparent Overlay
`;

const SettingsViewContainer = styled.div`
    display: grid;
    place-content: center;
    height: 100%;
    width: 100%;
`;

type PublicProps = {
    roomTitle: string;
};

export const MeetingContainer = ({
    roomTitle,
    history,
}: PublicProps & { history: RouteComponentProps["history"] }) => {
    const [roomFullError, setRoomFullError] = useState(false);
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
            const parsedJson = JSON.parse(rawData) as MeetingMetaData;
            return {
                ...parsedJson,
                muted: parsedJson.muted ?? true,
                videoEnabled: parsedJson.videoEnabled ?? false,
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

    const initializeSession = React.useCallback(async () => {
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

                const { audioInput, audioOutput, cam } = meetingMetaData.meetingInputOutputDevices;

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

                if (cam && meetingMetaData.videoEnabled && !meetingMetaData.forceVideoDisabled) {
                    promises.push(
                        (async () => {
                            await audioVideoManager.setVideoInputDeviceSafe(cam);
                            audioVideoManager.audioVideo.start();
                            audioVideoManager.audioVideo.startLocalVideoTile();
                        })(),
                    );
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
            try {
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
            } catch (err: any) {
                if (err.name === "RoomFullError") {
                    setRoomFullError(true);
                    return;
                }
                if (err.name === "CodeNotAllowedError") {
                    history.push("/?unknown-code");
                    return;
                }
                throw err;
            }
        }
    }, [roomManager, audioVideoManager.audioVideo]);
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
    }, [roomTitle, meetingMetaData?.role, audioVideoManager.audioVideo, roomManager, history]);

    return roomFullError ? (
        <ErrorFullScreen>
            <h2 style={{ color: "#ffffff" }}>
                Sorry, aber diese Watch-Party ist bereits <b>voll</b> mit einer gesammelten
                Mannschaft (11) 😟
            </h2>
            {/*<a href="/">*/}
            {/*    <button className="btn btn--secondary">Erstelle deine eigene Watch-Party</button>*/}
            {/*</a>*/}
        </ErrorFullScreen>
    ) : isLoading || !meetingMetaData.joinInfo ? (
        <LoadingAnimation fullScreen={true} />
    ) : meetingMetaData && roomTitle ? (
        showStartScreen ? (
            <SettingsViewContainer>
                <SettingsView
                    attendeeId={roomManager.attendeeId}
                    onCancel={() => history.push("/")}
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
            </SettingsViewContainer>
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
