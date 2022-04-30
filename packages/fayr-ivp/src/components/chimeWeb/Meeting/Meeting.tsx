import { useInjection } from "inversify-react";
import React, { SetStateAction } from "react";
import Types from "types/inject";

import useSocket from "hooks/useSocket";

import ISocketProvider from "components/chime/interfaces/ISocketProvider";
import Error from "components/chimeWeb/Error";
import { MeetingStatus, MeetingMetaData } from "components/chimeWeb/Meeting/meetingTypes";
import { formatMeetingSsKey } from "components/chimeWeb/Meeting/storage";
import { JoinInfo } from "components/chimeWeb/types";

// Styles
import "../ChimeWeb.scss";
import styles from "./Meeting.module.scss";

import * as config from "../../../config";
import Chat from "../../chat/Chat";
import IRoomManager from "../../chime/interfaces/IRoomManager";
import Portal from "../../common/Portal";
// Components
import VideoPlayer from "../../videoPlayer/VideoPlayer";
import CamSection from "../Cams/CamSection";
import Controls from "../Controls/Controls";
import VotingContainer from "../Voting/VotingContainer";
import ModalSettingsView from "./Settings/ModalSettingsView";

type PublicProps = {
    roomTitle: string;
};

type Props = MeetingMetaData &
    PublicProps & {
        joinInfo: JoinInfo;
        meetingStatus: MeetingStatus | null;
        setMeetingStatus: React.Dispatch<SetStateAction<MeetingStatus | null>>;
    };

const Meeting = ({
    userName,
    title,
    role,
    joinInfo,
    playbackURL,
    meetingStatus,
    forceMuted,
    roomTitle,
}: Props) => {
    const [showSettings, setShowSettings] = React.useState(false);

    const [errorState, setErrorState] = React.useState({
        showError: false,
        message: null as string | null,
    });

    const { setSocket } = useSocket();

    const closeError = () => setErrorState({ showError: false, message: null });

    // const setErrorMsg = (errorMsg: string) => {
    //     setErrorState({ message: errorMsg, showError: true });
    // };

    const socketProvider = useInjection<ISocketProvider>(Types.ISocketProvider);
    const attendeeId = useInjection<IRoomManager>(Types.IRoomManager).attendeeId;

    React.useEffect(() => {
        socketProvider.joinRoomSocket();
        setSocket(socketProvider);
    }, [setSocket, socketProvider]);

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

    const camSection = <CamSection joinInfo={joinInfo} />;

    return (
        <>
            {meetingStatus === "Success" && (
                <div className={styles.Meeting} onClick={handleSettingsClick}>
                    <div className={styles.MainStage}>
                        <VideoPlayer
                            videoStream={playbackURL}
                            fullScreenCamSection={camSection}
                            attendeeId={attendeeId!}
                        />

                        <VotingContainer attendeeId={attendeeId!} />

                        <Controls
                            baseHref={config.BASE_HREF}
                            ssName={formatMeetingSsKey(roomTitle)}
                            title={title}
                            openSettings={() => setShowSettings(true)}
                            role={role}
                        />

                        <Chat title={title} userName={userName} />
                    </div>

                    <div className={`full-height pos-relative ${styles.CamContainer}`}>
                        {camSection}
                    </div>

                    <Portal.Root />

                    {showSettings && (
                        <ModalSettingsView
                            attendeeId={attendeeId}
                            onContinue={() => setShowSettings(false)}
                            onCancel={() => setShowSettings(false)}
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
