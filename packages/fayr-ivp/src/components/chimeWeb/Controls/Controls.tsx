import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GlobalResetAction, ReduxStore } from "redux/store";

import usePersistedState from "hooks/usePersistedState";

import { Message } from "components/chat/types";
import {
    IChimeAudioVideoProvider,
    IChimeDevicePicker,
    IChimeSdkWrapper,
} from "components/chime/ChimeSdkWrapper";
import ReactionButtonSelection, {
    ReactionsDisabledIcon,
} from "components/chimeWeb/Controls/emoji-reactions/ReactionButtonSelection";
import Emoji from "components/common/Emoji";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

import { Cell, Flex, Grid } from "@fayr/shared-components";
import FayrLogo from "@fayr/shared-components/lib/FayrLogo";

import styles from "./Controls.module.scss";

import * as config from "../../../config";
import useGlobalKeyHandler from "../../../hooks/useGlobalKeyHandler";
import store from "../../../redux/store";
import { IDeviceProvider } from "../../chime/ChimeSdkWrapper";
import { ChatOpenContext } from "../../contexts/ChatOpenContext";
import { VotingOpenContext } from "../../contexts/VotingOpenContext";
import { MeetingMetaData } from "../Meeting/meetingTypes";
import CamToggle from "./Buttons/CamToggle";
import MicrophoneToggle from "./Buttons/MicrophoneToggle";

enum VideoStatus {
    Loading,
    Enabled,
    Disabled,
}

type Props = RouteComponentProps & {
    chime: IChimeSdkWrapper & IChimeAudioVideoProvider & IChimeDevicePicker & IDeviceProvider;
    title: string;
    openSettings(): void;
    role: string;
    ssName: string;
    baseHref: string;
};

type ReduxProps = {
    unreadMessages: Array<Message>;
};

const Controls: React.FC<Props & ReduxProps> = ({
    chime,
    title,
    openSettings,
    unreadMessages,
    role,
    ssName,
    baseHref,
    history,
}) => {
    const { isOpen: isChatOpen, set: setChatOpen } = React.useContext(ChatOpenContext);
    const { isOpen: isVotingOpen, set: setVotingOpen } = React.useContext(VotingOpenContext);

    const [meetingMetaData, setMeetingMetaData] = usePersistedState<MeetingMetaData>(ssName);

    const [localMuted, setLocalMuted] = React.useState(!chime.currentAudioInputDevice);
    const [videoStatus, setVideoStatus] = React.useState(
        chime.currentVideoInputDevice == null ? VideoStatus.Disabled : VideoStatus.Enabled,
    );
    const [showPopUp, setShowPopUp] = React.useState(false);

    const { selectedEmojiReaction, reactionsDisabled } = React.useContext(SelectedReactionContext);

    const isMobile = useMediaQuery({ maxWidth: 1024 });

    const [reactionsOpen, setReactionsOpen] = React.useState(false);

    const controlsRef = React.useRef<HTMLDivElement>(null);

    const withoutPropagation =
        (handler: () => Promise<void>): React.MouseEventHandler<HTMLDivElement> =>
        async (e) => {
            e.stopPropagation();
            e.preventDefault();

            await handler();
        };

    const toggleMute = async () => {
        if (localMuted) {
            const audioInputs = await chime.listAudioInputDevices();
            if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
                await chime.audioVideo?.chooseAudioInputDevice(audioInputs[0].deviceId);
                setMeetingMetaData({
                    ...meetingMetaData,
                    meetingInputOutputDevices: {
                        ...meetingMetaData.meetingInputOutputDevices,
                        audioInput: {
                            value: audioInputs[0].deviceId,
                            label: audioInputs[0].label,
                        },
                    },
                });
                chime.audioVideo.realtimeUnmuteLocalAudio();
                setLocalMuted(false);
            }
        } else {
            setLocalMuted(!localMuted);
            setMeetingMetaData({
                ...meetingMetaData,
                meetingInputOutputDevices: {
                    ...meetingMetaData.meetingInputOutputDevices,
                    audioInput: undefined,
                },
            });
            chime.audioVideo.realtimeMuteLocalAudio();
        }

        return Promise.resolve();
    };

    const reactionButtonOnClick = () => {
        setReactionsOpen((open) => !open);
        return Promise.resolve();
    };

    const toggleVideo = async () => {
        if (videoStatus === VideoStatus.Disabled) {
            setVideoStatus(VideoStatus.Loading);

            try {
                if (!chime.currentVideoInputDevice) {
                    const videoInputs = await chime.listVideoInputDevices();
                    const fallbackDevice = {
                        label: videoInputs[0].label,
                        value: videoInputs[0].deviceId,
                    };
                    await chime.chooseVideoInputDevice(fallbackDevice);
                }

                try {
                    await chime.chooseVideoInputDevice(chime.currentVideoInputDevice);
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            cam: chime.currentVideoInputDevice!,
                        },
                    });
                } catch (err) {
                    const videoInputDevices = await chime.audioVideo.listVideoInputDevices();
                    await chime.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            cam: {
                                label: videoInputDevices[0].label,
                                value: videoInputDevices[0].deviceId,
                            },
                        },
                    });
                }

                chime.audioVideo.startLocalVideoTile();

                setVideoStatus(VideoStatus.Enabled);
            } catch (error) {
                // eslint-disable-next-line
                console.error(error);
                setVideoStatus(VideoStatus.Disabled);

                setMeetingMetaData({
                    ...meetingMetaData,
                    meetingInputOutputDevices: {
                        ...meetingMetaData.meetingInputOutputDevices,
                        cam: undefined,
                    },
                });
            }
        } else if (videoStatus === VideoStatus.Enabled) {
            setVideoStatus(VideoStatus.Loading);
            chime.audioVideo.stopLocalVideoTile();
            setVideoStatus(VideoStatus.Disabled);

            setMeetingMetaData({
                ...meetingMetaData,
                meetingInputOutputDevices: {
                    ...meetingMetaData.meetingInputOutputDevices,
                    cam: undefined,
                },
            });
        }
    };

    const showPopUpTimed = () => {
        // show popup message
        setShowPopUp(true);

        // hide popup message after 2 seconds
        setTimeout(() => {
            setShowPopUp(false);
        }, 2000);
    };

    const copyTextToClipboard = async (text: string) => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                showPopUpTimed();
                if (config.DEBUG) console.log("Room link copied to clipboard");
            } catch (err) {
                if (config.DEBUG) console.log("Could not copy text: ", err);
            }
        }
    };

    const handleRoomClick = () => {
        const link = `${window.location.origin}${window.location.pathname.replace(
            "meeting",
            "index.html",
        )}?action=join&room=${title}`;
        if (config.DEBUG) {
            console.log(link);
        }
        copyTextToClipboard(encodeURI(link));

        return Promise.resolve();
    };

    const handleChatClick = () => {
        setChatOpen(!isChatOpen);
        return Promise.resolve();
    };

    const endButtonOnClick = async () => {
        await chime.leaveRoom(role === "host");
        store.dispatch(GlobalResetAction());
        sessionStorage.removeItem(ssName);
        const whereTo = `${baseHref}/${role === "host" ? "" : "join?room=" + title}`;
        history.push(whereTo);
    };

    React.useEffect(() => {
        if (chime.audioVideo) {
            const localChimeCopy = chime.audioVideo;

            localChimeCopy.realtimeSubscribeToMuteAndUnmuteLocalAudio(setLocalMuted);

            return () => localChimeCopy.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(setLocalMuted);
        }
    }, [chime.audioVideo]);

    React.useEffect(() => {
        if (controlsRef.current) {
            let touchDownX: number | null = null;

            const handleTouchStart = (event: TouchEvent) => {
                const { clientX } = event.touches[0];
                touchDownX = clientX;
            };

            const handleTouchMove = (event: TouchEvent) => {
                if (!touchDownX) {
                    return;
                }

                const { clientX: xUp } = event.touches[0];

                var xDiff = touchDownX - xUp;

                if (Math.abs(xDiff) > 30)
                    if (isChatOpen && xUp > touchDownX) {
                        setChatOpen(false);
                    } else if (!isChatOpen && xUp < touchDownX) {
                        setChatOpen(true);
                    }
            };

            const controlRef = controlsRef.current;

            controlRef.ontouchstart = handleTouchStart;
            controlRef.ontouchmove = handleTouchMove;

            return () => {
                controlRef.removeEventListener("touchstart", handleTouchStart);
                controlRef.removeEventListener("touchmove", handleTouchMove);
            };
        }
    }, [isChatOpen, isMobile, setChatOpen]);

    useGlobalKeyHandler(["m", "M", "keyM"], toggleMute);
    useGlobalKeyHandler(["c", "C", "keyC"], toggleVideo);
    const chat_controls = isChatOpen ? `${styles.Active}` : "";

    const popup = showPopUp ? "show" : "";

    const chatButton = (
        <div
            key="ChatButton"
            className={classNames(
                styles.Button,
                chat_controls,
                styles.ChatContainer,
                "btn rounded",
            )}
            title={`Chat ${isChatOpen ? "ausblenden" : "anzeigen"}`}
            onClick={withoutPropagation(handleChatClick)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 13 3 C 6.925 3 2 7.477 2 13 C 2 15.836604 3.3081273 18.387771 5.3964844 20.205078 C 5.0969391 21.186048 4.4721018 22.161699 3.3242188 23.03125 A 0.5 0.5 0 0 1 3.3222656 23.033203 A 0.5 0.5 0 0 0 3 23.5 A 0.5 0.5 0 0 0 3.5 24 A 0.5 0.5 0 0 0 3.6015625 23.988281 C 5.5416307 23.982628 7.1969423 23.153925 8.5136719 22.115234 C 9.1385204 22.369393 9.7907693 22.578929 10.470703 22.724609 C 10.166703 21.864609 10 20.949 10 20 C 10 15.037 14.486 11 20 11 C 21.382 11 22.699437 11.253891 23.898438 11.712891 C 23.202437 6.7988906 18.594 3 13 3 z M 20 13 A 8 7 0 0 0 12 20 A 8 7 0 0 0 20 27 A 8 7 0 0 0 22.984375 26.490234 C 24.210733 27.346924 25.694866 27.982344 27.394531 27.988281 A 0.5 0.5 0 0 0 27.5 28 A 0.5 0.5 0 0 0 28 27.5 A 0.5 0.5 0 0 0 27.671875 27.03125 C 26.756686 26.336428 26.170113 25.571619 25.818359 24.792969 A 8 7 0 0 0 28 20 A 8 7 0 0 0 20 13 z"
                    fill={isChatOpen ? "#07090C" : "#D2D2D2"}
                />
            </svg>
            {!isChatOpen && unreadMessages.length > 0 && (
                <span className={`${styles.Button} ${styles.UnreadTag}`}>
                    {unreadMessages.length > 99 ? "99+" : unreadMessages.length}
                </span>
            )}
        </div>
    );

    const buttons = [
        // {/* Microfon button */}
        // {/* <!-- on click, toggle this control between .${styles.Button}--mic_on and .${styles.Button}--mic_off --> */}
        <MicrophoneToggle toggleState={!localMuted} onClick={toggleMute} key="mictoggle" />,
        // {/* Camera button */}
        // {/* <!-- on click, toggle this control between .${styles.Button}--cam_on and .${styles.Button}--cam_off --> */}
        <CamToggle
            toggleState={videoStatus === VideoStatus.Enabled}
            onClick={toggleVideo}
            key="camtoggle"
        />,
        // {/* Setting button */}
        <div
            key="SettingsButton"
            className={`${styles.Button} btn rounded`}
            title="Nimm Änderungen an deinen Einstellungen vor"
            onClick={withoutPropagation(() => {
                openSettings();
                return Promise.resolve();
            })}
        >
            <svg
                className={styles.BtnSvg}
                fill="#D2D2D2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
            >
                <path d="M 15 2 C 14.448 2 14 2.448 14 3 L 14 3.171875 C 14 3.649875 13.663406 4.0763437 13.191406 4.1523438 C 12.962406 4.1893437 12.735719 4.2322031 12.511719 4.2832031 C 12.047719 4.3892031 11.578484 4.1265 11.396484 3.6875 L 11.330078 3.53125 C 11.119078 3.02125 10.534437 2.7782344 10.023438 2.9902344 C 9.5134375 3.2012344 9.2704219 3.785875 9.4824219 4.296875 L 9.5488281 4.4570312 C 9.7328281 4.8970313 9.5856875 5.4179219 9.1796875 5.6699219 C 8.9836875 5.7919219 8.7924688 5.9197344 8.6054688 6.0527344 C 8.2174688 6.3297344 7.68075 6.2666875 7.34375 5.9296875 L 7.2226562 5.8085938 C 6.8316562 5.4175937 6.1985937 5.4175938 5.8085938 5.8085938 C 5.4185938 6.1995938 5.4185938 6.8326563 5.8085938 7.2226562 L 5.9296875 7.34375 C 6.2666875 7.68075 6.3297344 8.2164688 6.0527344 8.6054688 C 5.9197344 8.7924687 5.7919219 8.9836875 5.6699219 9.1796875 C 5.4179219 9.5856875 4.8960781 9.7337812 4.4550781 9.5507812 L 4.296875 9.484375 C 3.786875 9.273375 3.2002813 9.5153906 2.9882812 10.025391 C 2.7772813 10.535391 3.0192969 11.120031 3.5292969 11.332031 L 3.6855469 11.396484 C 4.1245469 11.578484 4.3892031 12.047719 4.2832031 12.511719 C 4.2322031 12.735719 4.1873906 12.962406 4.1503906 13.191406 C 4.0753906 13.662406 3.649875 14 3.171875 14 L 3 14 C 2.448 14 2 14.448 2 15 C 2 15.552 2.448 16 3 16 L 3.171875 16 C 3.649875 16 4.0763437 16.336594 4.1523438 16.808594 C 4.1893437 17.037594 4.2322031 17.264281 4.2832031 17.488281 C 4.3892031 17.952281 4.1265 18.421516 3.6875 18.603516 L 3.53125 18.669922 C 3.02125 18.880922 2.7782344 19.465563 2.9902344 19.976562 C 3.2012344 20.486563 3.785875 20.729578 4.296875 20.517578 L 4.4570312 20.451172 C 4.8980312 20.268172 5.418875 20.415312 5.671875 20.820312 C 5.793875 21.016313 5.9206875 21.208484 6.0546875 21.396484 C 6.3316875 21.784484 6.2686406 22.321203 5.9316406 22.658203 L 5.8085938 22.779297 C 5.4175937 23.170297 5.4175938 23.803359 5.8085938 24.193359 C 6.1995938 24.583359 6.8326562 24.584359 7.2226562 24.193359 L 7.3457031 24.072266 C 7.6827031 23.735266 8.2174688 23.670266 8.6054688 23.947266 C 8.7934688 24.081266 8.9856406 24.210031 9.1816406 24.332031 C 9.5866406 24.584031 9.7357344 25.105875 9.5527344 25.546875 L 9.4863281 25.705078 C 9.2753281 26.215078 9.5173438 26.801672 10.027344 27.013672 C 10.537344 27.224672 11.121984 26.982656 11.333984 26.472656 L 11.398438 26.316406 C 11.580438 25.877406 12.049672 25.61275 12.513672 25.71875 C 12.737672 25.76975 12.964359 25.814562 13.193359 25.851562 C 13.662359 25.924562 14 26.350125 14 26.828125 L 14 27 C 14 27.552 14.448 28 15 28 C 15.552 28 16 27.552 16 27 L 16 26.828125 C 16 26.350125 16.336594 25.923656 16.808594 25.847656 C 17.037594 25.810656 17.264281 25.767797 17.488281 25.716797 C 17.952281 25.610797 18.421516 25.8735 18.603516 26.3125 L 18.669922 26.46875 C 18.880922 26.97875 19.465563 27.221766 19.976562 27.009766 C 20.486563 26.798766 20.729578 26.214125 20.517578 25.703125 L 20.451172 25.542969 C 20.268172 25.101969 20.415312 24.581125 20.820312 24.328125 C 21.016313 24.206125 21.208484 24.079312 21.396484 23.945312 C 21.784484 23.668312 22.321203 23.731359 22.658203 24.068359 L 22.779297 24.191406 C 23.170297 24.582406 23.803359 24.582406 24.193359 24.191406 C 24.583359 23.800406 24.584359 23.167344 24.193359 22.777344 L 24.072266 22.654297 C 23.735266 22.317297 23.670266 21.782531 23.947266 21.394531 C 24.081266 21.206531 24.210031 21.014359 24.332031 20.818359 C 24.584031 20.413359 25.105875 20.264266 25.546875 20.447266 L 25.705078 20.513672 C 26.215078 20.724672 26.801672 20.482656 27.013672 19.972656 C 27.224672 19.462656 26.982656 18.878016 26.472656 18.666016 L 26.316406 18.601562 C 25.877406 18.419563 25.61275 17.950328 25.71875 17.486328 C 25.76975 17.262328 25.814562 17.035641 25.851562 16.806641 C 25.924562 16.337641 26.350125 16 26.828125 16 L 27 16 C 27.552 16 28 15.552 28 15 C 28 14.448 27.552 14 27 14 L 26.828125 14 C 26.350125 14 25.923656 13.663406 25.847656 13.191406 C 25.810656 12.962406 25.767797 12.735719 25.716797 12.511719 C 25.610797 12.047719 25.8735 11.578484 26.3125 11.396484 L 26.46875 11.330078 C 26.97875 11.119078 27.221766 10.534437 27.009766 10.023438 C 26.798766 9.5134375 26.214125 9.2704219 25.703125 9.4824219 L 25.542969 9.5488281 C 25.101969 9.7318281 24.581125 9.5846875 24.328125 9.1796875 C 24.206125 8.9836875 24.079312 8.7915156 23.945312 8.6035156 C 23.668312 8.2155156 23.731359 7.6787969 24.068359 7.3417969 L 24.191406 7.2207031 C 24.582406 6.8297031 24.582406 6.1966406 24.191406 5.8066406 C 23.800406 5.4156406 23.167344 5.4156406 22.777344 5.8066406 L 22.65625 5.9296875 C 22.31925 6.2666875 21.782531 6.3316875 21.394531 6.0546875 C 21.206531 5.9206875 21.014359 5.7919219 20.818359 5.6699219 C 20.413359 5.4179219 20.266219 4.8960781 20.449219 4.4550781 L 20.515625 4.296875 C 20.726625 3.786875 20.484609 3.2002812 19.974609 2.9882812 C 19.464609 2.7772813 18.879969 3.0192969 18.667969 3.5292969 L 18.601562 3.6855469 C 18.419563 4.1245469 17.950328 4.3892031 17.486328 4.2832031 C 17.262328 4.2322031 17.035641 4.1873906 16.806641 4.1503906 C 16.336641 4.0753906 16 3.649875 16 3.171875 L 16 3 C 16 2.448 15.552 2 15 2 z M 15 7 C 19.078645 7 22.438586 10.054876 22.931641 14 L 16.728516 14 A 2 2 0 0 0 15 13 A 2 2 0 0 0 14.998047 13 L 11.896484 7.625 C 12.850999 7.222729 13.899211 7 15 7 z M 10.169922 8.6328125 L 13.269531 14 A 2 2 0 0 0 13 15 A 2 2 0 0 0 13.269531 15.996094 L 10.167969 21.365234 C 8.2464258 19.903996 7 17.600071 7 15 C 7 12.398945 8.2471371 10.093961 10.169922 8.6328125 z M 16.730469 16 L 22.931641 16 C 22.438586 19.945124 19.078645 23 15 23 C 13.899211 23 12.850999 22.777271 11.896484 22.375 L 14.998047 17 A 2 2 0 0 0 15 17 A 2 2 0 0 0 16.730469 16 z" />
            </svg>
        </div>,
        <div
            key="SharePartyButton"
            className={`${styles.Button} btn rounded popup`}
            onClick={withoutPropagation(handleRoomClick)}
            title="Leite den abgespeicherten Link an deine Freunde weiter"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 15 2.0019531 C 10.758 2.0019531 9 4.7229531 9 8.0019531 C 9 9.1059531 9.5273437 10.214844 9.5273438 10.214844 C 9.3153438 10.336844 8.9666875 10.724109 9.0546875 11.412109 C 9.2186875 12.695109 9.7749062 13.021828 10.128906 13.048828 C 10.263906 14.245828 11.55 15.777 12 16 L 12 18 C 11 21 3 19 3 26 L 14.523438 26 C 14.190437 25.06 14 24.054 14 23 C 14 19.461 16.047578 16.4085 19.017578 14.9375 C 19.426578 14.3675 19.801094 13.665828 19.871094 13.048828 C 20.225094 13.021828 20.781312 12.695109 20.945312 11.412109 C 21.033313 10.723109 20.684656 10.336844 20.472656 10.214844 C 20.472656 10.214844 21 9.2129531 21 8.0019531 C 21 5.5739531 20.047 3.5019531 18 3.5019531 C 18 3.5019531 17.289 2.0019531 15 2.0019531 z M 23 16 C 19.134 16 16 19.134 16 23 C 16 26.866 19.134 30 23 30 C 26.866 30 30 26.866 30 23 C 30 19.134 26.866 16 23 16 z M 23 19 C 23.552 19 24 19.447 24 20 L 24 22 L 26 22 C 26.552 22 27 22.447 27 23 C 27 23.553 26.552 24 26 24 L 24 24 L 24 26 C 24 26.553 23.552 27 23 27 C 22.448 27 22 26.553 22 26 L 22 24 L 20 24 C 19.448 24 19 23.553 19 23 C 19 22.447 19.448 22 20 22 L 22 22 L 22 20 C 22 19.447 22.448 19 23 19 z"
                    fill="#D2D2D2"
                />
            </svg>
            <span className={`popuptext ${popup}`} id="myPopup">
                Link gespeichert
            </span>
        </div>,
        chatButton,
        <div
            key="ReactionButton"
            className={`${styles.Button} ${styles.ReactionButton} btn rounded`}
            onClick={withoutPropagation(reactionButtonOnClick)}
        >
            {reactionsDisabled ? (
                <ReactionsDisabledIcon color="#D2D2D2" />
            ) : (
                <Emoji text={selectedEmojiReaction} />
            )}
            {reactionsOpen && (
                <div className={styles.ReactionRow}>
                    <ReactionButtonSelection onClose={() => setReactionsOpen(false)} />
                </div>
            )}
        </div>,
        // Voting Button
        <div
            key="VotingButton"
            className={`${styles.Button} ${styles.VotingButton} ${
                isVotingOpen ? `${styles.Active}` : ""
            } btn rounded`}
            onClick={withoutPropagation(() => {
                setVotingOpen(!isVotingOpen);
                return Promise.resolve();
            })}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#D2D2D2" viewBox="0 0 50 50">
                <path
                    d="M 30.644531 0 C 30.390625 0 30.136719 0.0976563 29.9375 0.292969 L 15.824219 14.410156 L 20.105469 18.6875 C 21.457031 17.632813 23.152344 17 25 17 C 29.410156 17 33 20.589844 33 25 C 33 26.847656 32.367188 28.542969 31.3125 29.898438 L 35.59375 34.175781 L 49.707031 20.0625 C 49.894531 19.871094 50 19.617188 50 19.355469 C 50 19.089844 49.894531 18.832031 49.707031 18.644531 L 45.988281 14.925781 L 39.707031 21.207031 C 39.511719 21.402344 39.257813 21.5 39 21.5 C 38.742188 21.5 38.488281 21.402344 38.292969 21.207031 L 28.792969 11.707031 C 28.402344 11.316406 28.402344 10.683594 28.792969 10.292969 L 35.074219 4.011719 L 31.355469 0.292969 C 31.15625 0.0976563 30.902344 0 30.644531 0 Z M 13.46875 2.820313 C 8.917969 5.191406 5.191406 8.917969 2.820313 13.46875 L 4.59375 14.390625 C 6.777344 10.207031 10.207031 6.777344 14.390625 4.59375 Z M 36.488281 5.429688 L 30.914063 11 L 39 19.085938 L 44.574219 13.515625 Z M 16.238281 8.148438 C 12.78125 9.953125 9.953125 12.78125 8.148438 16.238281 L 9.921875 17.160156 C 11.535156 14.070313 14.070313 11.535156 17.160156 9.921875 Z M 14.40625 15.824219 L 0.292969 29.9375 C 0.105469 30.128906 0 30.382813 0 30.644531 C 0 30.910156 0.105469 31.167969 0.292969 31.355469 L 4.011719 35.074219 L 10.292969 28.792969 C 10.683594 28.402344 11.316406 28.402344 11.707031 28.792969 L 21.207031 38.292969 C 21.597656 38.683594 21.597656 39.3125 21.207031 39.703125 L 14.925781 45.984375 L 18.644531 49.703125 C 18.839844 49.902344 19.097656 50 19.355469 50 C 19.609375 50 19.867188 49.902344 20.0625 49.707031 L 34.175781 35.589844 L 29.898438 31.3125 C 28.542969 32.367188 26.847656 33 25 33 C 20.589844 33 17 29.410156 17 25 C 17 23.152344 17.632813 21.457031 18.6875 20.101563 Z M 25 19 C 23.707031 19 22.511719 19.417969 21.53125 20.113281 L 29.886719 28.46875 C 30.582031 27.488281 31 26.292969 31 25 C 31 21.691406 28.308594 19 25 19 Z M 20.113281 21.53125 C 19.417969 22.511719 19 23.707031 19 25 C 19 28.308594 21.691406 31 25 31 C 26.292969 31 27.488281 30.582031 28.46875 29.886719 Z M 11 30.914063 L 5.425781 36.488281 L 13.511719 44.574219 L 19.082031 39 Z M 40.039063 32.914063 C 38.4375 35.949219 35.949219 38.4375 32.914063 40.039063 L 33.84375 41.808594 C 37.238281 40.015625 40.015625 37.238281 41.808594 33.84375 Z M 45.390625 35.640625 C 43.210938 39.800781 39.800781 43.210938 35.640625 45.390625 L 36.566406 47.160156 C 41.089844 44.792969 44.792969 41.089844 47.160156 36.566406 Z"
                    fill="#D2D2D2"
                />
            </svg>
        </div>,
        // End button
        <div
            key="EndButton"
            className={`${styles.Button} btn rounded btn--destruct btn--leave`}
            onClick={withoutPropagation(endButtonOnClick)}
            title="Verlasse die Watch Party"
        >
            <svg
                className={styles.BtnSvg}
                xmlns="http://www.w3.org/2000/svg"
                fill="#D2D2D2"
                viewBox="0 0 30 30"
            >
                <path d="M 14.984375 2.9863281 A 1.0001 1.0001 0 0 0 14 4 L 14 15 A 1.0001 1.0001 0 1 0 16 15 L 16 4 A 1.0001 1.0001 0 0 0 14.984375 2.9863281 z M 9.9960938 4.2128906 A 1.0001 1.0001 0 0 0 9.5449219 4.328125 C 5.6645289 6.3141271 3 10.347825 3 15 C 3 21.615466 8.3845336 27 15 27 C 21.615466 27 27 21.615466 27 15 C 27 10.347825 24.335471 6.3141271 20.455078 4.328125 A 1.0001544 1.0001544 0 1 0 19.544922 6.109375 C 22.780529 7.7653729 25 11.110175 25 15 C 25 20.534534 20.534534 25 15 25 C 9.4654664 25 5 20.534534 5 15 C 5 11.110175 7.2194712 7.7653729 10.455078 6.109375 A 1.0001 1.0001 0 0 0 9.9960938 4.2128906 z" />
            </svg>
        </div>,
    ];

    return (
        <Flex
            direction="Row"
            mainAlign="Center"
            className={styles.Controls}
            onClick={(e: any) => {
                if (isMobile) {
                    e.stopPropagation();
                    e.preventDefault();
                    setChatOpen(!isChatOpen);
                }
            }}
            ref={controlsRef}
        >
            <FayrLogo className={styles.FayrIcon} />
            {isMobile && isChatOpen && (
                <Flex direction="Row" mainAlign="Start" className={styles.ControlsMinified}>
                    <Grid
                        className={styles.ControlsMinifiedBlock}
                        gridProperties={{
                            gridTemplateRows: "50% 50%",
                            gridTemplateColumns: "50% 50%",
                            gap: 0,
                        }}
                    >
                        {buttons.slice(0, 4).map((x, index) => (
                            <Cell key={index} className={styles.MinifiedControlButtonCell}>
                                {x}
                            </Cell>
                        ))}
                    </Grid>
                    {chatButton}
                </Flex>
            )}
            {(!isMobile || (isMobile && !isChatOpen)) && buttons}
        </Flex>
    );
};

const mapStateToProps = (state: ReduxStore): ReduxProps => {
    return {
        unreadMessages: state.chatMessageReducer.filter((x) => !x.seen) ?? [],
    };
};

export default connect(mapStateToProps)(withRouter(Controls));
