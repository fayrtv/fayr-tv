// Framework
import { MediaPlayer } from "amazon-ivs-player";
import * as config from "config";
import * as React from "react";

import { Flex } from "@fayr/common";

import styles from "./VideoPlayerControls.module.scss";

import { IDriftSyncStrategy } from "../driftSyncStrategies/interfaces";
import QualityPicker from "./QualityPicker";
import StreamHealthIndicator from "./StreamHealthIndicator";
// Components
import StreamVolumeControl from "./StreamVolumeControl";

type Props = {
    fullScreen: boolean;
    player: MediaPlayer | undefined;
    video: HTMLDivElement | null;
    driftSyncStrategy: IDriftSyncStrategy<number>;
};

export const VideoPlayerControls = ({ fullScreen, player, video, driftSyncStrategy }: Props) => {
    const [paused, setPaused] = React.useState(false);

    const pause = React.useCallback(() => {
        const currentPlayer = player!;
        paused ? currentPlayer.play() : currentPlayer.pause();
        setPaused(!paused);
    }, [player, paused]);

    const onPauseClick: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();
            pause();
        },
        [pause],
    );

    const toggleFullScreen: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();

            fullScreen ? document.exitFullscreen() : video!.requestFullscreen();
        },
        [video, fullScreen],
    );

    const streamControl =
        config.streamSync.streamSynchronizationType === "LiveStream" ? (
            <StreamHealthIndicator driftSyncStrategy={driftSyncStrategy} player={player} />
        ) : (
            <button
                id="play"
                className={`mg-x-1 player-btn player-btn--icon bottom-0 relative ${
                    paused ? "player-btn--pause" : "player-btn--play"
                }`}
                onClick={onPauseClick}
            >
                <svg
                    className="icon player-icon player-icon--play"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                >
                    <path d="M 6 3 A 1 1 0 0 0 5 4 A 1 1 0 0 0 5 4.0039062 L 5 15 L 5 25.996094 A 1 1 0 0 0 5 26 A 1 1 0 0 0 6 27 A 1 1 0 0 0 6.5800781 26.8125 L 6.5820312 26.814453 L 26.416016 15.908203 A 1 1 0 0 0 27 15 A 1 1 0 0 0 26.388672 14.078125 L 6.5820312 3.1855469 L 6.5800781 3.1855469 A 1 1 0 0 0 6 3 z" />
                </svg>
                <svg
                    className="icon player-icon player-icon--pause"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                >
                    <path d="M 8 4 C 6.895 4 6 4.895 6 6 L 6 24 C 6 25.105 6.895 26 8 26 L 10 26 C 11.105 26 12 25.105 12 24 L 12 6 C 12 4.895 11.105 4 10 4 L 8 4 z M 20 4 C 18.895 4 18 4.895 18 6 L 18 24 C 18 25.105 18.895 26 20 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 6 C 24 4.895 23.105 4 22 4 L 20 4 z" />
                </svg>
            </button>
        );

    return (
        <div id="player-controls" className={fullScreen ? "fullscreen" : ""}>
            <Flex className={styles.PlayerControlsContainer} direction="Row" crossAlign="Center">
                {streamControl}

                {/* Button: Volume */}
                <StreamVolumeControl player={player} />

                {/* Button: Fullscreen - Note: As of yet, there's no way to show fullscreen on mobile safari. */}
                {video && video.requestFullscreen && (
                    <button
                        id="fullscreen"
                        className="mg-x-1 player-btn player-btn--icon bottom-0 relative"
                        onClick={toggleFullScreen}
                    >
                        {!fullScreen && (
                            <svg
                                className="icon player-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path
                                    fill="#D2D2D2"
                                    d="M 6 4 C 4.9069372 4 4 4.9069372 4 6 L 4 10 A 1.0001 1.0001 0 1 0 6 10 L 6 6 L 10 6 A 1.0001 1.0001 0 1 0 10 4 L 6 4 z M 20 4 A 1.0001 1.0001 0 1 0 20 6 L 24 6 L 24 10 A 1.0001 1.0001 0 1 0 26 10 L 26 6 C 26 4.9069372 25.093063 4 24 4 L 20 4 z M 4.984375 18.986328 A 1.0001 1.0001 0 0 0 4 20 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 10 26 A 1.0001 1.0001 0 1 0 10 24 L 6 24 L 6 20 A 1.0001 1.0001 0 0 0 4.984375 18.986328 z M 24.984375 18.986328 A 1.0001 1.0001 0 0 0 24 20 L 24 24 L 20 24 A 1.0001 1.0001 0 1 0 20 26 L 24 26 C 25.093063 26 26 25.093063 26 24 L 26 20 A 1.0001 1.0001 0 0 0 24.984375 18.986328 z"
                                />
                            </svg>
                        )}
                        {fullScreen && (
                            <svg
                                className="icon player-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path
                                    fill="#D2D2D2"
                                    d="M 9.984375 3.9863281 A 1.0001 1.0001 0 0 0 9 5 L 9 9 L 5 9 A 1.0001 1.0001 0 1 0 5 11 L 10 11 A 1.0001 1.0001 0 0 0 11 10 L 11 5 A 1.0001 1.0001 0 0 0 9.984375 3.9863281 z M 19.984375 3.9863281 A 1.0001 1.0001 0 0 0 19 5 L 19 10 A 1.0001 1.0001 0 0 0 20 11 L 25 11 A 1.0001 1.0001 0 1 0 25 9 L 21 9 L 21 5 A 1.0001 1.0001 0 0 0 19.984375 3.9863281 z M 5 19 A 1.0001 1.0001 0 1 0 5 21 L 9 21 L 9 25 A 1.0001 1.0001 0 1 0 11 25 L 11 20 A 1.0001 1.0001 0 0 0 10 19 L 5 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 25 A 1.0001 1.0001 0 1 0 21 25 L 21 21 L 25 21 A 1.0001 1.0001 0 1 0 25 19 L 20 19 z"
                                />
                            </svg>
                        )}
                    </button>
                )}
                <QualityPicker player={player} />
            </Flex>
        </div>
    );
};

export default VideoPlayerControls;
