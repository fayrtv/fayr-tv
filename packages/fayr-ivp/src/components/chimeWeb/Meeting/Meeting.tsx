import React, { SetStateAction } from "react";
import * as config from "../../../config";

// Components
import VideoPlayer from "../../videoPlayer/VideoPlayer";
import Chat from "../../chat/Chat";
import Controls from "../Controls";
import Settings from "../Settings";
import Error from "components/chimeWeb/Error";
import VotingContainer from "../Voting/VotingContainer";
import ChimeSdkWrapper from "components/chime/ChimeSdkWrapper";
import { JoinInfo } from "components/chimeWeb/types";

// Styles
import "../ChimeWeb.scss";
import styles from "./Meeting.module.scss";
import { formatMeetingSsKey } from "components/chimeWeb/Meeting/storage";
import { MeetingStatus, SSData } from "components/chimeWeb/Meeting/meetingTypes";
import CamSection from "../Cams/CamSection";

type PublicProps = {
    chime: ChimeSdkWrapper;
    roomTitle: string;
};

type Props = SSData &
    PublicProps & {
        joinInfo: JoinInfo;
        meetingStatus: MeetingStatus | null;
        setMeetingStatus: React.Dispatch<SetStateAction<MeetingStatus | null>>;
    };

const Meeting = ({
    chime,
    username,
    title,
    role,
    joinInfo,
    playbackURL,
    meetingStatus,
    setMeetingStatus,
    roomTitle,
}: Props) => {
    const [showSettings, setShowSettings] = React.useState(false);

    const [errorState, setErrorState] = React.useState({
        showError: false,
        message: null as string | null,
    });

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

    const camSection = <CamSection chime={chime} joinInfo={joinInfo} />;

    return (
        <>
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
                            ssName={formatMeetingSsKey(roomTitle)}
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

export default Meeting;