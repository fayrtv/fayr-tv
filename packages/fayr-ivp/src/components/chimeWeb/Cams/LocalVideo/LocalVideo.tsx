import classNames from "classnames";
import { useInjection } from "inversify-react";
import React from "react";
import { Nullable } from "types/global";
import Types from "types/inject";

import useMeetingMetaData from "hooks/useMeetingMetaData";
import useSocket from "hooks/useSocket";

import { SocketEventType } from "components/chime/interfaces/ISocketProvider";
import { JoinInfo } from "components/chimeWeb/types";

import { Flex, MaterialIcon } from "@fayr/common";

import commonCamStyles from "../Cam.module.scss";
import styles from "./LocalVideo.module.scss";

import IAudioVideoManager from "../../../chime/interfaces/IAudioVideoManager";
import CamOverlay from "../CamOverlay";
import { ActivityState, ActivityStateChangeDto } from "../types";
import DiagonalDash from "./DiagonalDash";

type Props = {
    joinInfo: JoinInfo;
    pin(id: Nullable<string>): void;
};

const LocalVideo = ({ joinInfo, pin }: Props) => {
    const videoElement = React.useRef<HTMLVideoElement>(null);

    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    const [{ muted, videoEnabled }] = useMeetingMetaData();

    const { socket } = useSocket();

    const [activityState, setActivityState] = React.useState(ActivityState.Available);

    const [cameraBlurred, setCameraBlurred] = React.useState(false);
    React.useEffect(() => {
        if (audioVideoManager.audioVideo) {
            if (!audioVideoManager.audioVideo.getLocalVideoTile()) {
                audioVideoManager.audioVideo.addObserver({
                    videoTileDidUpdate: (tileState: any) => {
                        if (
                            !tileState.boundAttendeeId ||
                            !tileState.localTile ||
                            !tileState.tileId ||
                            !videoElement.current
                        ) {
                            return;
                        }

                        audioVideoManager.audioVideo.bindVideoElement(
                            tileState.tileId,
                            videoElement.current,
                        );
                    },
                });
            } else {
                const currentTile = audioVideoManager.audioVideo.getLocalVideoTile()!.state();

                audioVideoManager.audioVideo.bindVideoElement(
                    currentTile.tileId!,
                    videoElement.current!,
                );
            }
        }
    }, [audioVideoManager.audioVideo]);

    const onAfkClick = React.useCallback(() => {
        if (!socket) {
            return;
        }

        const newState =
            activityState === ActivityState.Available
                ? ActivityState.AwayFromKeyboard
                : ActivityState.Available;

        socket.send<ActivityStateChangeDto>({
            messageType: SocketEventType.ActivityStateChange,
            payload: {
                attendeeId: joinInfo.Attendee.AttendeeId,
                activityState: newState,
            },
        });

        setActivityState(newState);
    }, [joinInfo.Attendee.AttendeeId, socket, activityState]);

    const onBlurClick = React.useCallback(
        async (newBlurState: boolean) => {
            if (!videoEnabled) {
                return;
            }

            await audioVideoManager.changeBlurState(newBlurState);
            setCameraBlurred(newBlurState);
        },
        [audioVideoManager, videoEnabled],
    );

    const micMuteCls = muted ? "controls__btn--mic_on" : "controls__btn--mic_off";

    return (
        <div className={styles.LocalVideo}>
            <div className={commonCamStyles.cam}>
                <div className={commonCamStyles.preview}>
                    <div className={classNames("pos-relative", commonCamStyles.VideoContainer)}>
                        <video className={commonCamStyles.AttendeeCam} ref={videoElement} />
                        {activityState === ActivityState.AwayFromKeyboard && (
                            <CamOverlay activityState={ActivityState.AwayFromKeyboard} />
                        )}
                    </div>
                </div>
                <Flex
                    className={commonCamStyles.ParticipantMeta}
                    id={`${joinInfo.Attendee.AttendeeId}`}
                    space="Between"
                >
                    <span className={styles.MyName}>Ich</span>
                    <Flex mainAlign="Center" direction="Row">
                        <span style={{ marginTop: "2px", height: "16px" }}>
                            {activityState === ActivityState.Available ? (
                                <MaterialIcon
                                    size={16}
                                    color="white"
                                    iconName="keyboard"
                                    onClick={onAfkClick}
                                />
                            ) : (
                                <DiagonalDash onClick={onAfkClick}>
                                    <MaterialIcon
                                        size={16}
                                        color="white"
                                        iconName="keyboard"
                                        onClick={onAfkClick}
                                    />
                                </DiagonalDash>
                            )}
                        </span>
                        <span className={`${micMuteCls} btn--mic`}>
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
                                iconName={cameraBlurred ? "blur_on" : "blur_off"}
                                onClick={() => onBlurClick(!cameraBlurred)}
                            />
                        </span>
                        <span style={{ marginTop: "2px" }}>
                            <MaterialIcon
                                size={16}
                                color="white"
                                iconName="push_pin"
                                onClick={() => pin(null)}
                            />
                        </span>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
};

export default LocalVideo;
