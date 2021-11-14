import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import React from "react";
import { usePersistedState } from "hooks/usePersistedState";
import useLoadingGuard from "hooks/useLoadingGuard";
import * as config from "config";
import AudioVideoObserver from "amazon-chime-sdk-js/build/audiovideoobserver/AudioVideoObserver";
import { MeetingSessionStatusCode } from "amazon-chime-sdk-js";
import LoadingAnimation from "components/common/interactivity/LoadingAnimation";
import ChimeSdkWrapper from "components/chime/ChimeSdkWrapper";
import { formatMeetingSsKey } from "components/chimeWeb/Meeting/storage";
import { MeetingStatus, SSData } from "components/chimeWeb/Meeting/meetingTypes";
import Meeting from "components/chimeWeb/Meeting/Meeting";
import { JoinInfo } from "components/chimeWeb/types";

type PublicProps = {
    chime: ChimeSdkWrapper;
    roomCode: string;
};

export const MeetingContainer = ({
    chime,
    roomCode,
    history,
}: PublicProps & { history: RouteComponentProps["history"] }) => {
    const audioElementRef = React.createRef<HTMLAudioElement>();
    // const myVideoElement = React.createRef<HTMLVideoElement>();

    // Will be undefined on direct URL loading without previously filling meeting fields
    const [state, setState] = usePersistedState<SSData | undefined>(formatMeetingSsKey(roomCode));

    // Loading, Success or Failed
    const [meetingStatus, setMeetingStatus] = React.useState<MeetingStatus | null>(null);

    const initializeSession = React.useCallback(
        async () => {
            if (!state) {
                return;
            }
            if (state.joinInfo) {
                // Browser refresh
                await chime.reInitializeMeetingSession(state.joinInfo, state.username);
            } else {
                const joinInfo: JoinInfo = await chime.createRoom(
                    state.role,
                    state.username,
                    state.title,
                    state.playbackURL,
                );
                setState((current) => ({
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
    const { isLoading } = useLoadingGuard(!state?.joinInfo, initializeSession);

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

    React.useEffect(() => {
        // Perform cleanup
        return () => {
            chime.leaveRoom(state?.role === "host").then((_) => {
                if (config.DEBUG) console.debug("Left room");
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!state || !chime.audioVideo) {
            return;
        }

        const observer: AudioVideoObserver = {
            audioVideoDidStop: async (sessionStatus) => {
                if (sessionStatus.statusCode() === MeetingSessionStatusCode.AudioCallEnded) {
                    const whereTo = `${config.BASE_HREF}/${state.role === "host" ? "" : "end"}`;
                    // noinspection ES6MissingAwait
                    chime.leaveRoom(state.role === "host");
                    history.push(whereTo);
                }
            },
        };
        chime.audioVideo.addObserver(observer);
        return () => chime.audioVideo?.removeObserver(observer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode, state?.role, chime, history]);

    return isLoading ? (
        <LoadingAnimation fullScreen={true} />
    ) : state && roomCode ? (
        <>
            <audio ref={audioElementRef} style={{ display: "none" }} />
            <Meeting
                chime={chime}
                roomCode={roomCode}
                meetingStatus={meetingStatus}
                setMeetingStatus={setMeetingStatus}
                joinInfo={state.joinInfo!}
                role={state.role}
                title={state.title}
                username={state.username}
                playbackURL={state.playbackURL}
            />
        </>
    ) : (
        <Redirect to={`${config.BASE_HREF}/`} />
    );
};

const MeetingRouter = ({
    location,
    history,
    chime,
}: Omit<RouteComponentProps & PublicProps, "roomCode">) => {
    const roomCode = React.useMemo<string | null>(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get("room");
    }, [location.search]);

    return roomCode ? (
        <MeetingContainer chime={chime} roomCode={roomCode} history={history} />
    ) : (
        <Redirect to={`${config.BASE_HREF}/`} />
    );
};

export default withRouter(MeetingRouter);
