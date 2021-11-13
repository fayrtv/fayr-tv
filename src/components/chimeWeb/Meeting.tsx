import React, { SetStateAction } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import * as config from "../../config";

import useLoadingGuard from "hooks/useLoadingGuard";
import { MeetingSessionStatusCode } from "amazon-chime-sdk-js";

// Components
import VideoPlayer from "../videoPlayer/VideoPlayer";
import Chat from "../chat/Chat";
import Controls from "./Controls";
import Settings from "./Settings";
import LocalVideo from "./LocalVideo";
import RemoteVideoGroup from "./RemoteVideoGroup";
import Error from "./Error";
import VotingContainer from "./Voting/VotingContainer";
import ChimeSdkWrapper from "components/chime/ChimeSdkWrapper";
import AudioVideoObserver from "amazon-chime-sdk-js/build/audiovideoobserver/AudioVideoObserver";
import LoadingAnimation from "components/common/interactivity/LoadingAnimation";
import { JoinInfo } from "components/chimeWeb/types";

// Styles
import "./ChimeWeb.scss";
import styles from "./Meeting.module.scss";

type SSData = {
    username: string;
    title: string;
    role: string;
    joinInfo: JoinInfo;
    playbackURL: string;
};

type MeetingStatus = "Loading" | "Success" | "Failed";

type PublicProps = {
    chime: ChimeSdkWrapper;
};

type Props = SSData &
    PublicProps & {
        roomCode: string;
        meetingStatus: MeetingStatus | null;
        setMeetingStatus: React.Dispatch<SetStateAction<MeetingStatus | null>>;
    };

const formatMeetingSsKey = (roomCode: string) => `chime[${roomCode}]`;

const MeetingFC = ({
    chime,
    username,
    title,
    role,
    joinInfo,
    playbackURL,
    meetingStatus,
    setMeetingStatus,
    roomCode,
}: Props) => {
    const [showSettings, setShowSettings] = React.useState(false);

    const audioElementRef = React.createRef<HTMLAudioElement>();

    React.useEffect(() => {
        if (!joinInfo) {
            // TODO: Not sure why this gets called every time
            // if (state.joinInfo) {
            //     // Browser refresh
            //     setLoading(true);
            //     chime.reInitializeMeetingSession(joinInfo, state.username).then(() => {
            //         setLoading(false);
            //     });
            // }
        }
    }, [joinInfo]);

    React.useEffect(() => {
        if (audioElementRef.current) {
            chime.joinRoom(audioElementRef.current).then(() => {
                setMeetingStatus("Success");
            });
        }
    }, [audioElementRef, chime, joinInfo, setMeetingStatus]);

    const [errorState, setErrorState] = React.useState({
        showError: false,
        message: null as string | null,
    });

    // const myVideoElement = React.createRef<HTMLVideoElement>();

    const closeError = () => setErrorState({ showError: false, message: null });

    // const setErrorMsg = (errorMsg: string) => {
    //     setErrorState({ message: errorMsg, showError: true });
    // };

    const handleSettingsClick = (event: any) => {
        if (showSettings) {
            let node = event.target;
            let isModal = false;
            while (node) {
                if (node && node.classList && node.classList.contains("modal__el")) {
                    isModal = true;
                    break;
                }
                node = node.parentNode;
            }
            if (!isModal) {
                setShowSettings(false);
            }
        }
    };

    const camSection = (
        <div className={styles.CamSection}>
            <LocalVideo key="LocalVideo" chime={chime} joinInfo={joinInfo} />
            <RemoteVideoGroup key="RemoteVideoGroup" chime={chime} joinInfo={joinInfo} />
        </div>
    );

    return (
        <>
            <audio ref={audioElementRef} style={{ display: "none" }} />

            {meetingStatus === "Success" && (
                <div className={`app-grid ${styles.Meeting}`} onClick={handleSettingsClick}>
                    <div className={`main-stage ${styles.MainStage}`}>
                        <VideoPlayer
                            videoStream={playbackURL}
                            fullScreenCamSection={camSection}
                            attendeeId={chime.attendeeId!}
                        />

                        <VotingContainer chime={chime} attendeeId={chime.attendeeId!} />

                        <Controls
                            chime={chime}
                            baseHref={config.BASE_HREF}
                            ssName={formatMeetingSsKey(roomCode)}
                            title={title}
                            openSettings={() => setShowSettings(true)}
                            role={role}
                        />

                        <Chat chimeSocket={chime} title={title} userName={username} />
                    </div>

                    <div className={`full-height pos-relative ${styles.CamContainer}`}>
                        {camSection}
                    </div>

                    {showSettings && (
                        <Settings
                            chime={chime}
                            joinInfo={joinInfo}
                            saveSettings={(
                                _playbackURL,
                                _currentAudioInputDevice,
                                _currentAudioOutputDevice,
                                _currentVideoInputDevice,
                            ) => {
                                setShowSettings(false);
                                // TODO: Handle playback URL and new devices
                            }}
                            closeSettings={() => setShowSettings(false)}
                        />
                    )}
                </div>
            )}

            {errorState.showError && (
                <Error closeError={closeError} errorMsg={errorState.message} />
            )}
        </>
    );
};

const MeetingContainer = ({ location, history, chime }: RouteComponentProps & PublicProps) => {
    const roomCode = React.useMemo<string | null>(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get("room");
    }, [location.search]);

    const _ssData = React.useMemo(() => {
        if (!roomCode) {
            return undefined;
        }
        const ssName = formatMeetingSsKey(roomCode);
        const ssDataRaw = sessionStorage.getItem(ssName);

        if (!ssDataRaw) {
            return undefined;
        }

        const data: SSData = ssDataRaw && JSON.parse(ssDataRaw);
        if (data && config.DEBUG) console.log(data);

        return data;
    }, [roomCode]);

    const [state, setState] = React.useState<SSData | undefined>(_ssData);

    const updateSsData = React.useCallback(
        (newValue: SSData) => {
            sessionStorage.setItem(formatMeetingSsKey(roomCode!), JSON.stringify(newValue));
            setState(newValue);
        },
        [roomCode, setState],
    );

    // Loading, Success or Failed
    const [meetingStatus, setMeetingStatus] = React.useState<MeetingStatus | null>(null);

    const loadFunc = React.useCallback(
        () => chime.createRoom(state!.role, state!.username, state!.title, state!.playbackURL),
        [chime, state],
    );
    const { isLoading } = useLoadingGuard(!state?.joinInfo, loadFunc, (joinInfo) =>
        updateSsData({
            ...state!,
            joinInfo: joinInfo,
        }),
    );

    React.useEffect(() => {
        if (!roomCode || !state || !chime.audioVideo) {
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
        return () => chime.audioVideo.removeObserver(observer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode, state?.role, chime, history]);

    return isLoading ? (
        <LoadingAnimation fullScreen={true} />
    ) : state && roomCode ? (
        <MeetingFC
            chime={chime}
            roomCode={roomCode}
            meetingStatus={meetingStatus}
            setMeetingStatus={setMeetingStatus}
            {...state}
        />
    ) : (
        <Redirect to={`${config.BASE_HREF}/`} />
    );
};

export default withRouter(MeetingContainer);
