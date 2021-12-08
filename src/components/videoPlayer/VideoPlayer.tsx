import React, { MouseEventHandler } from "react";
import { isPlayerSupported, MediaPlayer, PlayerEventType, PlayerState } from "amazon-ivs-player";
import * as config from "../../config";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";
import { SocketEventType } from "../chime/types";
import { EmojiReactionTransferObject } from "../chimeWeb/types";
import useSocket from "hooks/useSocket";
import StreamVolumeControl from "./controls/StreamVolumeControl";

import styles from "./VideoPlayer.module.scss";
import Emoji from "components/common/Emoji";
import { makeid } from "util/guidHelper";
import useManyClickHandlers from "hooks/useManyClickHandlers";
import { EMOJI_SIZE } from "components/chimeWeb/Controls/emoji-reactions/EmojiReactionButton";

type Props = {
    videoStream: string;
    fullScreenCamSection: React.ReactNode;
    attendeeId: string;
};

type EmojiReaction = { emoji: string; relativeXClick: number; relativeYClick: number };

const VideoPlayer = ({ videoStream, fullScreenCamSection, attendeeId }: Props) => {
    const videoElement = React.useRef<HTMLDivElement>(null);
    const player = React.useRef<MediaPlayer>();

    const [paused, setPaused] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(false);

    const [reactions, setReactions] = React.useState<Array<React.ReactNode>>([]);

    const onPauseClick: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();

            const currentPlayer = player.current!;
            paused ? currentPlayer.play() : currentPlayer.pause();
            setPaused(!paused);
        },
        [paused],
    );

    const toggleFullScreen: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();

            fullScreen ? document.exitFullscreen() : videoElement.current!.requestFullscreen();
        },
        [fullScreen],
    );

    const mediaPlayerScriptLoaded = React.useCallback(() => {
        const mediaPlayerPackage = (window as any).IVSPlayer;

        const playerOverlay = document.getElementById("overlay")!;

        // First, check if the browser supports the Amazon IVS player.
        if (!isPlayerSupported) {
            console.warn(
                "Leider unterstützt dein Browser FAYR TV nicht. Wir empfehlen Google Chrome oder Firefox ;-)",
            );
            return;
        }

        // Initialize player
        const initializedPlayer: MediaPlayer = mediaPlayerPackage.create();
        player.current = initializedPlayer;
        initializedPlayer.attachHTMLVideoElement(
            document.getElementById("video-player")! as HTMLVideoElement,
        );

        // Attach event listeners
        initializedPlayer.addEventListener(PlayerState.PLAYING, function () {
            if (config.DEBUG) console.log("Player State - PLAYING");
        });
        initializedPlayer.addEventListener(PlayerState.ENDED, function () {
            if (config.DEBUG) console.log("Player State - ENDED");
        });
        initializedPlayer.addEventListener(PlayerState.READY, function () {
            if (config.DEBUG) console.log("Player State - READY");
        });
        initializedPlayer.addEventListener(PlayerEventType.ERROR, function (err: any) {
            if (config.DEBUG) console.warn("Player Event - ERROR:", err);
        });

        initializedPlayer.addEventListener(PlayerEventType.TEXT_METADATA_CUE, function (cue: any) {
            const metadataText = cue.text;
            const position = initializedPlayer.getPosition().toFixed(2);
            if (config.DEBUG)
                console.log(
                    `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`,
                );
        });

        // Setup stream and play
        initializedPlayer.setAutoplay(true);
        initializedPlayer.load(videoStream);

        // Setvolume
        initializedPlayer.setVolume(0.3);

        // Show/Hide player controls
        playerOverlay.addEventListener(
            "mouseover",
            function () {
                playerOverlay.classList.add("overlay--hover");
            },
            false,
        );

        playerOverlay.addEventListener("mouseout", function () {
            playerOverlay.classList.remove("overlay--hover");
        });
    }, [videoStream]);

    React.useEffect(() => {
        const mediaPlayerScript = document.createElement("script");
        mediaPlayerScript.src = "https://player.live-video.net/1.5.0/amazon-ivs-player.min.js";
        // mediaPlayerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.6/video.min.js";
        mediaPlayerScript.async = true;
        mediaPlayerScript.onload = mediaPlayerScriptLoaded;

        document.body.appendChild(mediaPlayerScript);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!videoElement.current) {
            return;
        }

        const cb = (_: Event) => setFullScreen((x) => !x);

        const currentVideoElement = videoElement.current;
        videoElement.current.onfullscreenchange = cb;

        return () => currentVideoElement?.removeEventListener("fullscreenchange", cb);
    }, [videoElement]);

    const { selectedEmojiReaction, reactionsDisabled } = React.useContext(SelectedReactionContext);
    const { socket } = useSocket();

    const [uncommittedReactions, setUncommittedReactions] = React.useState<EmojiReaction[]>([]);

    const publishReaction = React.useCallback(
        (reaction: EmojiReaction) => {
            if (!socket) {
                return;
            }
            setUncommittedReactions((curr) => [...curr, reaction]);
            socket.send<EmojiReactionTransferObject>({
                messageType: SocketEventType.EmojiReaction,
                payload: {
                    attendeeId,
                    emoji: reaction.emoji,
                    clickPosition: {
                        relativeX: reaction.relativeXClick,
                        relativeY: reaction.relativeYClick,
                    },
                },
            });
        },
        [attendeeId, socket],
    );

    const removeReactionEmojiAfterDelay = (reaction: JSX.Element) => {
        setTimeout(() => {
            setReactions((reactions) => reactions.filter((x) => x !== reaction));
        }, 2000);
    };

    const renderReactionEmoji = React.useCallback(
        (reaction: EmojiReaction) => {
            setReactions((currentReactions) => {
                const { height, width } = videoElement.current!.getBoundingClientRect();
                const actualTop = height * reaction.relativeYClick - EMOJI_SIZE / 2;
                const actualLeft = width * reaction.relativeXClick - EMOJI_SIZE / 2;

                const key = makeid(8);
                const newReaction = (
                    <div
                        key={`${reaction.emoji}_${key}`}
                        className={styles.Reaction}
                        style={{ top: actualTop, left: actualLeft }}
                    >
                        <Emoji text={reaction.emoji} />
                    </div>
                );

                const newReactions = [...currentReactions, newReaction];

                removeReactionEmojiAfterDelay(newReaction);

                return newReactions;
            });
        },
        [videoElement],
    );

    const onVideoClicked: MouseEventHandler = React.useCallback(
        (event) => {
            if (reactionsDisabled || !socket || !videoElement.current) {
                return;
            }

            const { height, width } = videoElement.current.getBoundingClientRect();
            const { clientX, clientY } = event;

            const relativeXClick = Number((clientX / width).toFixed(3));
            const relativeYClick = Number((clientY / height).toFixed(3));

            const reaction: EmojiReaction = {
                emoji: selectedEmojiReaction,
                relativeXClick,
                relativeYClick,
            };
            publishReaction(reaction);
            renderReactionEmoji(reaction);
        },
        [publishReaction, reactionsDisabled, socket, selectedEmojiReaction, renderReactionEmoji],
    );

    const onVideoDoubleClicked: MouseEventHandler = toggleFullScreen;
    const videoClickHandler = useManyClickHandlers(onVideoClicked, onVideoDoubleClicked);

    React.useEffect(() => {
        if (!socket || !videoElement.current) {
            return;
        }

        return socket.addListener<EmojiReactionTransferObject>(
            SocketEventType.EmojiReaction,
            ({ emoji, clickPosition }) => {
                const { relativeX, relativeY } = clickPosition!;

                const emojiReaction: EmojiReaction = {
                    emoji,
                    relativeXClick: relativeX,
                    relativeYClick: relativeY,
                };

                // Remove from uncommited reactions
                setUncommittedReactions((curr) =>
                    curr.filter((x) => !reactionsEqual(x, emojiReaction)),
                );

                renderReactionEmoji(emojiReaction);

                return Promise.resolve();
            },
        );
    }, [renderReactionEmoji, socket, uncommittedReactions]);

    React.useEffect(() => {
        if (reactionsDisabled) {
            setReactions([]);
        }
    }, [reactionsDisabled]);

    return (
        <div ref={videoElement} className="player-wrapper">
            <div
                id="overlay"
                className={`overlay ${fullScreen ? "fullscreen" : ""}`}
                onClick={videoClickHandler}
            >
                <div id="player-controls">
                    <div className={`player-controls__inner ${fullScreen ? "player-btn--maximize" : "player-btn--minimize"}`}>

                        {/* Button: Play/Pause  */}
                        <button
                            id="play"
                            className={`mg-x-1 player-btn player-btn--icon ${
                                paused ? "player-btn--pause" : "player-btn--play"
                            }`}
                            onClick={onPauseClick}
                        >
                            <svg
                                className="player-icon player-icon--play"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 6 3 A 1 1 0 0 0 5 4 A 1 1 0 0 0 5 4.0039062 L 5 15 L 5 25.996094 A 1 1 0 0 0 5 26 A 1 1 0 0 0 6 27 A 1 1 0 0 0 6.5800781 26.8125 L 6.5820312 26.814453 L 26.416016 15.908203 A 1 1 0 0 0 27 15 A 1 1 0 0 0 26.388672 14.078125 L 6.5820312 3.1855469 L 6.5800781 3.1855469 A 1 1 0 0 0 6 3 z" />
                            </svg>
                            <svg
                                className="player-icon player-icon--pause"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 8 4 C 6.895 4 6 4.895 6 6 L 6 24 C 6 25.105 6.895 26 8 26 L 10 26 C 11.105 26 12 25.105 12 24 L 12 6 C 12 4.895 11.105 4 10 4 L 8 4 z M 20 4 C 18.895 4 18 4.895 18 6 L 18 24 C 18 25.105 18.895 26 20 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 6 C 24 4.895 23.105 4 22 4 L 20 4 z" />
                            </svg>
                        </button>
                        
                        {/* Button: Volume */}
                        <StreamVolumeControl player={player.current} />

                        {/* Button: Fullscreen  */}
                        <button
                            id="fullscreen"
                            className="mg-x-1 player-btn player-btn--icon"
                            onClick={toggleFullScreen}
                        >
                            <svg
                                className="player-icon player-icon--fullscreen_on"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path
                                    fill="#D2D2D2"
                                    d="M 6 4 C 4.9069372 4 4 4.9069372 4 6 L 4 10 A 1.0001 1.0001 0 1 0 6 10 L 6 6 L 10 6 A 1.0001 1.0001 0 1 0 10 4 L 6 4 z M 20 4 A 1.0001 1.0001 0 1 0 20 6 L 24 6 L 24 10 A 1.0001 1.0001 0 1 0 26 10 L 26 6 C 26 4.9069372 25.093063 4 24 4 L 20 4 z M 4.984375 18.986328 A 1.0001 1.0001 0 0 0 4 20 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 10 26 A 1.0001 1.0001 0 1 0 10 24 L 6 24 L 6 20 A 1.0001 1.0001 0 0 0 4.984375 18.986328 z M 24.984375 18.986328 A 1.0001 1.0001 0 0 0 24 20 L 24 24 L 20 24 A 1.0001 1.0001 0 1 0 20 26 L 24 26 C 25.093063 26 26 25.093063 26 24 L 26 20 A 1.0001 1.0001 0 0 0 24.984375 18.986328 z"
                                />
                            </svg>
                            <svg
                                className="player-icon player-icon--fullscreen_off"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                            >
                                <path
                                    fill="#D2D2D2"
                                    d="M 9.984375 3.9863281 A 1.0001 1.0001 0 0 0 9 5 L 9 9 L 5 9 A 1.0001 1.0001 0 1 0 5 11 L 10 11 A 1.0001 1.0001 0 0 0 11 10 L 11 5 A 1.0001 1.0001 0 0 0 9.984375 3.9863281 z M 19.984375 3.9863281 A 1.0001 1.0001 0 0 0 19 5 L 19 10 A 1.0001 1.0001 0 0 0 20 11 L 25 11 A 1.0001 1.0001 0 1 0 25 9 L 21 9 L 21 5 A 1.0001 1.0001 0 0 0 19.984375 3.9863281 z M 5 19 A 1.0001 1.0001 0 1 0 5 21 L 9 21 L 9 25 A 1.0001 1.0001 0 1 0 11 25 L 11 20 A 1.0001 1.0001 0 0 0 10 19 L 5 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 25 A 1.0001 1.0001 0 1 0 21 25 L 21 21 L 25 21 A 1.0001 1.0001 0 1 0 25 19 L 20 19 z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <video
                id="video-player"
                className={`el-player ${fullScreen ? "fullscreen" : ""}`}
                playsInline
            />
            {reactions}
            {fullScreen && <div className="FullScreenCams">{fullScreenCamSection}</div>}
        </div>
    );
};

const reactionsEqual = (x: EmojiReaction, y: EmojiReaction) => {
    return (
        x.emoji === y.emoji &&
        x.relativeXClick === y.relativeXClick &&
        x.relativeYClick === y.relativeYClick
    );
};

export default VideoPlayer;
