// Framework
import React from "react";
import { CSSTransition } from "react-transition-group";
import Emoji from "react-emoji-render";

// Functionality
import useSocket from "hooks/useSocket";

// Components
import Flex from "components/common/Flex";

// Types
import { SocketEventType } from "components/chime/types";
import { Nullable } from "types/global";
import { EmojiReactionTransferObject } from "components/chimeWeb/types";
import { IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";

import "../Cam.scss";
import styles from "./ParticipantVideo.module.scss";
import MaterialIcon from "components/common/MaterialIcon";

type Props = {
    muted: boolean;
    attendeeId: string;
    videoEnabled: boolean;
    name: string;
    chime: IChimeSdkWrapper;
    tileIndex: number;
    volume: number;
    pin(id: string): void;
};

const ParticipantVideo = ({
    muted,
    attendeeId,
    videoEnabled,
    name,
    chime,
    tileIndex,
    volume,
    pin,
}: Props) => {
    const [showMeta, setShowMeta] = React.useState(true);
    const [talking, setTalking] = React.useState(false);
    const [emojiReaction, setEmojiReaction] = React.useState<Nullable<string>>(null);

    const videoRef = React.useRef<HTMLVideoElement>(null);

    const { socket } = useSocket();

    const talkingTimeout = React.useRef<number>(-1);

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
    const micMuteCls = muted ? "controls__btn--mic_on" : "controls__btn--mic_off";
    const micTalkingIndicator = talking ? "controls__btn--talking" : "";
    const metaCls = showMetaCombined ? "" : " cam__meta--hide";
    const videoId = `video_${attendeeId}`;

    return (
        <div
            className={`cam ${attendeeId ? "" : "hidden"}`}
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
                className={`cam__meta${metaCls} ${micTalkingIndicator}`}
                direction="Row"
                space="Between"
            >
                <span className="cam__meta_name">{name}</span>
                <Flex mainAlign="Center" direction="Row">
                    <span className={`${micMuteCls} btn--mic`} data-id={attendeeId}>
                        <svg
                            className="attendee mg-l-1 btn__svg btn__svg--sm btn__svg--mic_on"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 14C13.66 14 14.99 12.66 14.99 11L15 5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.3 11C17.3 14 14.76 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.24 19 14.42 19 11H17.3Z"
                                fill="white"
                            />
                        </svg>
                        <svg
                            className="attendee mg-l-1 btn__svg btn__svg--sm btn__svg--mic_off"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 11H17.3C17.3 11.74 17.14 12.43 16.87 13.05L18.1 14.28C18.66 13.3 19 12.19 19 11ZM14.98 11.17C14.98 11.11 15 11.06 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V5.18L14.98 11.17ZM4.27 3L3 4.27L9.01 10.28V11C9.01 12.66 10.34 14 12 14C12.22 14 12.44 13.97 12.65 13.92L14.31 15.58C13.6 15.91 12.81 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C13.91 17.59 14.77 17.27 15.54 16.82L19.73 21L21 19.73L4.27 3Z"
                                fill="white"
                            />
                        </svg>
                    </span>
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
