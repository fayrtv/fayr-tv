import { isPlayerSupported, MediaPlayer, PlayerEventType, PlayerState } from "amazon-ivs-player";
import React, { MouseEventHandler } from "react";
import { makeid } from "util/guidHelper";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useManyClickHandlers from "hooks/useManyClickHandlers";
import useSocket from "hooks/useSocket";

import { EMOJI_SIZE } from "components/chimeWeb/Controls/emoji-reactions/EmojiReactionButton";
import Emoji from "components/common/Emoji";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";

import styles from "./VideoPlayer.module.scss";

import * as config from "../../config";
import { SocketEventType } from "../chime/types";
import { EmojiReactionTransferObject } from "../chimeWeb/types";
import VideoPlayerControls from "./controls/VideoPlayerControls";

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

    const pause = React.useCallback(() => {
        const currentPlayer = player.current!;
        paused ? currentPlayer.play() : currentPlayer.pause();
        setPaused(!paused);
    }, [paused]);

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

    const rewind = () => {};
    const fastForward = () => {};

    useGlobalKeyHandler("ArrowLeft", rewind);
    useGlobalKeyHandler("ArrowRight", fastForward);
    useGlobalKeyHandler([" ", "Space"], pause);

    return (
        <div ref={videoElement} className="player-wrapper">
            <div
                id="overlay"
                className={`overlay ${fullScreen ? "fullscreen" : ""}`}
                onClick={videoClickHandler}
            >
                <VideoPlayerControls
                    fullScreen={fullScreen}
                    player={player.current}
                    video={videoElement.current}
                />
            </div>
            <video
                id="video-player"
                className={`el-player ${fullScreen ? "fullscreen" : ""}`}
                playsInline
            />
            {reactions}
            {fullScreen && <div className={styles.FullScreenCams}>{fullScreenCamSection}</div>}
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
