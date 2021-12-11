import React from "react";
import { Nullable } from "types/global";

import { JoinInfo } from "components/chimeWeb/types";
import MaterialIcon from "components/common/MaterialIcon";

import { Flex } from "@fayr/shared-components";

import "../Cam.scss";
import styles from "./LocalVideo.module.scss";

type Props = {
    chime: any;
    joinInfo: JoinInfo;
    pin(id: Nullable<string>): void;
};

const LocalVideo = ({ chime, joinInfo, pin }: Props) => {
    const videoElement = React.useRef<HTMLVideoElement>(null);

    const [enabled, setEnabled] = React.useState(false);
    const [muted, setMuted] = React.useState(false);
    const [showMeta, setShowMeta] = React.useState(true);

    const rosterCallback = React.useCallback(
        (newRoster: any) => {
            let attendeeId;
            for (attendeeId in newRoster) {
                // Exclude others
                if (attendeeId !== joinInfo.Attendee.AttendeeId) {
                    continue;
                }

                setMuted(newRoster[attendeeId].muted);
            }
        },
        [joinInfo.Attendee.AttendeeId],
    );

    React.useEffect(() => {
        const hideMetaInfoTimeout = setTimeout(() => setShowMeta(false), 2500);

        chime.subscribeToRosterUpdate(rosterCallback);

        if (chime.audioVideo) {
            if (!chime.audioVideo.videoTileController.currentLocalTile) {
                chime.audioVideo.addObserver({
                    videoTileDidUpdate: (tileState: any) => {
                        if (
                            !tileState.boundAttendeeId ||
                            !tileState.localTile ||
                            !tileState.tileId ||
                            !videoElement.current
                        ) {
                            return;
                        }

                        chime.audioVideo.bindVideoElement(tileState.tileId, videoElement.current);

                        setEnabled(tileState.active);
                    },
                });
            } else {
                const currentTile = chime.audioVideo.videoTileController.currentLocalTile.tileState;

                chime.audioVideo.bindVideoElement(currentTile.tileId, videoElement.current);

                setEnabled(currentTile.active);
            }
        }

        return () => {
            chime.unsubscribeFromRosterUpdate(rosterCallback);
            clearTimeout(hideMetaInfoTimeout);
        };
    }, [chime, rosterCallback]);

    const handleMouseEnter = React.useCallback(() => setShowMeta(true), []);

    const handleMouseLeave = React.useCallback(() => setShowMeta(false), []);

    // always show metadata when muted
    const showMetaCombined = showMeta || muted || !enabled;

    const micMuteCls = muted ? "controls__btn--mic_on" : "controls__btn--mic_off";
    const metaCls = showMetaCombined ? "" : " participantMeta--hide";

    return (
        <div
            className={styles.LocalVideo}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="cam">
                <div className="preview">
                    <div className="video-container pos-relative">
                        <video className="attendee_cam" ref={videoElement} />
                    </div>
                </div>
                <Flex
                    className={`participantMeta ${metaCls}`}
                    id={`${joinInfo.Attendee.AttendeeId}`}
                    space="Between"
                >
                    ich
                    <Flex mainAlign="Center" direction="Row">
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
