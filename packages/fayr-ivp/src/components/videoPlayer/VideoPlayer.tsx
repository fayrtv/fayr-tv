import { isPlayerSupported, MediaPlayer, PlayerEventType, PlayerState } from "amazon-ivs-player";
import classNames from "classnames";
import { VFB_STREAM_TIMINGS } from "config";
import { useInjection } from "inversify-react";
import { Duration } from "moment";
import React, { MouseEventHandler } from "react";
import { RoomMemberRole } from "types/Room";
import Types from "types/inject";
import { formatDiffAsCountdown, useTimedFeatureToggle } from "util/dateUtil";
import { makeid } from "util/guidHelper";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useManyClickHandlers from "hooks/useManyClickHandlers";

import IChimeEvents from "components/chime/interfaces/IChimeEvents";
import Controls from "components/chimeWeb/Controls/Controls";
import { EMOJI_SIZE } from "components/chimeWeb/Controls/emoji-reactions/EmojiReactionButton";
import Emoji from "components/common/Emoji";
import { SelectedReactionContext } from "components/contexts/SelectedReactionContext";
import LiveStreamCatchUpStrategy from "components/videoPlayer/driftSyncStrategies/liveStreamCatchUpStrategy";
import VideoCatchUpStrategy from "components/videoPlayer/driftSyncStrategies/videoCatchUpStrategy";
import useContentSynchronizer from "components/videoPlayer/useContentSynchronizer";
import { EmojiReaction, useEmojiReactions } from "components/videoPlayer/useEmojiReactions";

import styles from "./VideoPlayer.module.scss";

import * as config from "../../config";
import VideoPlayerControls from "./controls/VideoPlayerControls";

type Props = {
    videoStream: string;
    fullScreenCamSection: React.ReactNode;
    attendeeId: string;
    title: string;
    role: RoomMemberRole;
    ssName: string;
    baseHref: string;
    openSettings(): void;
    fullScreen: boolean;
    setFullScreen: (fs: boolean) => void;
};

function AdOverlay({ timeRemaining }: { timeRemaining: Duration | undefined }) {
    if (!timeRemaining || timeRemaining.as("s") <= 0) {
        return <></>;
    }

    const shouldFadeOut = timeRemaining.as("s") < 20;

    return (
        <div className={classNames(styles.AdOverlay, { [styles.FadeOutSlow]: shouldFadeOut })}>
            {timeRemaining && (
                <h1 style={{ color: "white" }}>{formatDiffAsCountdown(timeRemaining)}</h1>
            )}
        </div>
    );
}

const VideoPlayer = ({
    videoStream,
    fullScreenCamSection,
    attendeeId,
    title,
    role,
    ssName,
    baseHref,
    openSettings,
    fullScreen,
    setFullScreen,
}: Props) => {
    const videoElement = React.useRef<HTMLDivElement>(null);
    const [player, setPlayer] = React.useState<MediaPlayer>();
    const [paused, setPaused] = React.useState(false);

    const { selectedEmojiReaction, reactionsDisabled } = React.useContext(SelectedReactionContext);

    const chimeEvents = useInjection<IChimeEvents>(Types.IChimeEvents);

    const { reactionElements, addEmojiReaction } = useEmojiReactions(
        attendeeId,
        (reaction: EmojiReaction) => {
            const { height, width } = videoElement.current!.getBoundingClientRect();
            const actualTop = height * reaction.relativeYClick - EMOJI_SIZE / 2;
            const actualLeft = width * reaction.relativeXClick - EMOJI_SIZE / 2;

            const key = makeid(8);

            return (
                <div
                    key={`${reaction.emoji}_${key}`}
                    className={styles.Reaction}
                    style={{ top: actualTop, left: actualLeft }}
                >
                    <Emoji text={reaction.emoji} />
                </div>
            );
        },
        reactionsDisabled,
    );

    const driftSyncStrategy = React.useMemo(() => {
        switch (config.streamSync.streamSynchronizationType) {
            case "LiveStream":
                return new LiveStreamCatchUpStrategy();
            case "Static":
                return new VideoCatchUpStrategy();
            default:
                throw Error("Unknown stream synchronization type");
        }
    }, []);
    useContentSynchronizer(attendeeId, player, driftSyncStrategy);

    const pause = React.useCallback(() => {
        if (!player) {
            return;
        }
        paused ? player.play() : player.pause();
        setPaused(!paused);
    }, [paused, player]);

    const toggleFullScreen: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();

            fullScreen ? document.exitFullscreen() : videoElement.current!.requestFullscreen();
        },
        [fullScreen],
    );

    React.useEffect(() => {
        const onRoomLeft = () => {
            const videoPlayer = document.getElementById("video-player")! as HTMLVideoElement | null;

            player?.pause();
            videoPlayer?.pause();
        };

        chimeEvents.roomLeft.register(onRoomLeft);
        return () => chimeEvents.roomLeft.unregister(onRoomLeft);
    }, [chimeEvents]);

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
        setPlayer(initializedPlayer);
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

        // @ts-ignore
        window.seek = (aheadOrBehind: number) =>
            initializedPlayer.seekTo(initializedPlayer.getPosition() + aheadOrBehind);

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

        //@ts-ignore
        window.ivpDebug = {
            seek(plusMinus: number) {
                //@ts-ignore
                player.current?.seekTo(player.current?.getLiveLatency() + plusMinus);
            },
        };
    }, [videoStream]);

    React.useEffect(() => {
        const mediaPlayerScript = document.createElement("script");
        mediaPlayerScript.src = "https://player.live-video.net/1.5.0/amazon-ivs-player.min.js";
        // mediaPlayerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.6/video.min.js";
        mediaPlayerScript.async = true;
        mediaPlayerScript.onload = mediaPlayerScriptLoaded;

        document.body.appendChild(mediaPlayerScript);
    }, []);

    React.useEffect(() => {
        if (!videoElement.current) {
            return;
        }

        const cb = (_: Event) => setFullScreen(!fullScreen);

        const currentVideoElement = videoElement.current;
        videoElement.current.onfullscreenchange = cb;

        return () => currentVideoElement?.removeEventListener("fullscreenchange", cb);
    }, [fullScreen, setFullScreen, videoElement]);

    const onVideoClicked: MouseEventHandler = React.useCallback(
        (event) => {
            if (reactionsDisabled || !videoElement.current) {
                return;
            }

            const { height, width } = videoElement.current.getBoundingClientRect();
            const { clientX, clientY } = event;

            addEmojiReaction({
                emoji: selectedEmojiReaction,
                relativeXClick: Number((clientX / width).toFixed(3)),
                relativeYClick: Number((clientY / height).toFixed(3)),
            });
        },
        [reactionsDisabled, selectedEmojiReaction, addEmojiReaction],
    );

    const onVideoDoubleClicked: MouseEventHandler = toggleFullScreen;
    const videoClickHandler = useManyClickHandlers(onVideoClicked, onVideoDoubleClicked);

    const rewind = () => {};
    const fastForward = () => {};

    useGlobalKeyHandler("ArrowLeft", rewind);
    useGlobalKeyHandler("ArrowRight", fastForward);
    useGlobalKeyHandler([" ", "Space"], pause);

    const { isEnabled: shouldShowAdOverlay, timeRemaining } = useTimedFeatureToggle(
        VFB_STREAM_TIMINGS.StreamOverlayAd,
    );

    return (
        <div ref={videoElement} className={styles.PlayerWrapper}>
            <div
                id="overlay"
                className={classNames("overlay", { fullScreen: fullScreen }, styles.Overlay)}
                onClick={videoClickHandler}
            >
                <VideoPlayerControls
                    fullScreen={fullScreen}
                    player={player}
                    video={videoElement.current}
                    driftSyncStrategy={driftSyncStrategy}
                    role={role}
                    ssName={ssName}
                    baseHref={baseHref}
                />
            </div>
            <div className={classNames(styles.VideoPlayer, { [styles.fullscreen]: fullScreen })}>
                {shouldShowAdOverlay && <AdOverlay timeRemaining={timeRemaining} />}
                <video id="video-player" playsInline />
            </div>
            {reactionElements}
            {fullScreen && <div className={styles.FullScreenCams}>{fullScreenCamSection}</div>}
            {fullScreen && (
                <Controls
                    attendeeId={attendeeId!}
                    title={title}
                    openSettings={openSettings}
                    fullScreen={true}
                />
            )}
        </div>
    );
};

export default VideoPlayer;
