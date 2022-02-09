import classNames from "classnames";
import React from "react";
import { CSSTransition } from "react-transition-group";
import { Nullable } from "types/global";

import { useAttendeeInfo } from "hooks/useAttendeeInfo";
import useSocket from "hooks/useSocket";
import useSocketResponse from "hooks/useSocketResponse";
import useTranslations from "hooks/useTranslations";

import { IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";
import { SocketEventType } from "components/chime/types";
import { EmojiReactionTransferObject, ForceMicChangeDto } from "components/chimeWeb/types";
import Emoji from "components/common/Emoji";

import { MaterialIcon, Flex, Spinner } from "@fayr/shared-components";

import "../Cam.scss";
import styles from "./ParticipantVideo.module.scss";

import { ForceCamChangeDto } from "../../types";

type Props = {
    isSelfHost: boolean;
    onMicClick: (attendeeId: string) => void;
    muted: boolean;
    forceMuted: boolean;
    videoEnabled: boolean;
    forceVideoDisabled: boolean;
    attendeeId: string;
    name: string;
    chime: IChimeSdkWrapper;
    tileIndex: number;
    volume: number;
    pin(id: string): void;
};

const ParticipantVideo = ({
    isSelfHost,
    onMicClick,
    forceMuted,
    muted,
    attendeeId,
    videoEnabled,
    forceVideoDisabled,
    name,
    chime,
    tileIndex,
    volume,
    pin,
}: Props) => {
    const { getAttendee } = useAttendeeInfo();

    const [showMeta, setShowMeta] = React.useState(true);
    const [talking, setTalking] = React.useState(false);
    const [emojiReaction, setEmojiReaction] = React.useState<Nullable<string>>(null);
    const [micChangeRunning, sendMicChange] = useSocketResponse(
        SocketEventType.ForceAttendeeMicChange,
    );
    const [videoChangeRunning, sendVideoChange] = useSocketResponse(
        SocketEventType.ForceAttendeeVideoChange,
    );

    const videoRef = React.useRef<HTMLVideoElement>(null);

    const { socket } = useSocket();

    const talkingTimeout = React.useRef<number>(-1);

    const tl = useTranslations();

    const onMicClicked = React.useCallback(() => {
        sendMicChange<ForceMicChangeDto>(
            {
                messageType: SocketEventType.ForceAttendeeMicChange,
                payload: {
                    attendeeId,
                    isForceMuted: !getAttendee(attendeeId)?.forceMuted ?? true,
                },
            },
            3000,
        );
    }, [sendMicChange, attendeeId, getAttendee, isSelfHost]);

    const onVideoClick = React.useCallback(() => {
        sendVideoChange<ForceCamChangeDto>(
            {
                messageType: SocketEventType.ForceAttendeeVideoChange,
                payload: {
                    attendeeId,
                    forceVideoDisabled: !getAttendee(attendeeId)?.forceVideoDisabled ?? true,
                },
            },
            3000,
        );
    }, [sendVideoChange, attendeeId, getAttendee, isSelfHost]);

    React.useEffect(() => {
        if (!chime.audioVideo) {
            return;
        }
        const tile = chime.audioVideo.getVideoTile(tileIndex);

        if (!tile) {
            return;
        }

        if (videoRef?.current) {
            chime.audioVideo.bindVideoElement(tileIndex, videoRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chime.audioVideo, tileIndex]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        return socket.addListener<EmojiReactionTransferObject>(
            SocketEventType.EmojiReaction,
            (event: EmojiReactionTransferObject) => {
                if (attendeeId === event.attendeeId) {
                    setEmojiReaction(event.emoji);
                }

                setTimeout(() => setEmojiReaction(null), 2000);

                return Promise.resolve();
            },
        );
    }, [attendeeId, socket]);

    React.useEffect(() => {
        if (volume > 0) {
            setTalking(true);

            // Give this some time to timeout, so the indicator does not constantly blink off and on due to the
            // surrounding throttled updated
            talkingTimeout.current = window.setTimeout(() => {
                setTalking(false);
            }, 1500);
        }
    }, [volume]);

    React.useEffect(() => {
        if (muted) {
            // Hide meta info after 2 seconds
            setTimeout(() => setShowMeta(false), 2000);
        }
    }, [muted]);

    const handleMouseEnter = () => setShowMeta(true);
    const handleMouseLeave = () => setShowMeta(false);

    const showMetaCombined = showMeta || muted || !videoEnabled;
    const micTalkingIndicator = talking ? "controls__btn--talking" : "";
    const metaCls = showMetaCombined ? "" : " participantMeta--hide";
    const videoId = `video_${attendeeId}`;

    const renderDeviceToggle = (title: string, runningState: boolean, icon: React.ReactNode) => (
        <span
            className={classNames({
                "cursor-pointer": isSelfHost,
            })}
            style={{ marginTop: "2px" }}
            title={title}
            data-id={attendeeId}
        >
            {runningState ? (
                <div className={styles.Spinner}>
                    <Spinner />
                </div>
            ) : (
                icon
            )}
        </span>
    );

    return (
        <div
            className={classNames("cam", { hidden: !attendeeId })}
            key={attendeeId}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="preview">
                <div className="video-container pos-relative">
                    <video ref={videoRef} className="attendee_cam remote-attendee" id={videoId} />
                    <CSSTransition
                        in={emojiReaction !== null}
                        timeout={3000}
                        classNames={{
                            appear: styles.ParticipantVideoEmojiEnter,
                            enter: styles.ParticipantVideoEmojiEnter,
                            appearActive: styles.ParticipantVideoEmojiEnterActive,
                            enterActive: styles.ParticipantVideoEmojiEnterActive,
                            exitActive: styles.ParticipantVideoEmojiExitActive,
                            exit: styles.ParticipantVideoEmojiExit,
                        }}
                        unmountOnExit
                    >
                        <div>
                            <div className="video-container-fade"></div>
                            <Flex className="emoji-reaction" mainAlign="Center" crossAlign="Center">
                                <Emoji text={emojiReaction ?? ""} />
                            </Flex>
                        </div>
                    </CSSTransition>
                </div>
            </div>
            <Flex
                className={`participantMeta${metaCls} ${micTalkingIndicator}`}
                direction="Row"
                space="Between"
            >
                <span className="participantMeta_name">{name}</span>
                <Flex mainAlign="Center" direction="Row" className={styles.ParticipantControls}>
                    {renderDeviceToggle(
                        forceMuted ? tl.ParticipantVideo_ForceMuted : "",
                        micChangeRunning,
                        <MaterialIcon
                            size={16}
                            color={forceMuted ? "red" : "white"}
                            iconName={muted ? "mic_off" : "mic"}
                            onClick={isSelfHost ? onMicClicked : void 0}
                        />,
                    )}
                    {renderDeviceToggle(
                        forceVideoDisabled ? tl.ParticipantVideo_ForceCamDisabled : "",
                        videoChangeRunning,
                        <MaterialIcon
                            size={16}
                            color={forceVideoDisabled ? "red" : "white"}
                            iconName={videoEnabled ? "videocam" : "videocam_off"}
                            onClick={isSelfHost ? onVideoClick : void 0}
                        />,
                    )}
                    <span style={{ marginTop: "2px" }}>
                        <MaterialIcon
                            size={16}
                            color="white"
                            iconName="push_pin"
                            onClick={() => pin(attendeeId)}
                        />
                    </span>
                </Flex>
            </Flex>
        </div>
    );
};

export default ParticipantVideo;
