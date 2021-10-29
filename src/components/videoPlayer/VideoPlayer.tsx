import React, { MouseEventHandler } from "react";
import { MediaPlayer, PlayerState, PlayerEventType, isPlayerSupported } from 'amazon-ivs-player';
import * as config from "../../config";
import { SelectedReactionContext } from 'components/contexts/SelectedReactionContext';
import { SocketEventType } from '../chime/types';
import { EmojiReactionTransferObject } from "../chimeWeb/types";
import useSocket from "hooks/useSocket";
import StreamVolumeControl from "./controls/StreamVolumeControl";

import styles from "./VideoPlayer.module.scss";
import Emoji from "react-emoji-render";
import { makeid } from '../../util/guidHelper';

type Props = {
	videoStream: string;
	fullScreenCamSection: React.ReactNode;
	attendeeId: string;
}

const VideoPlayer = ({ videoStream, fullScreenCamSection, attendeeId }: Props) => {

	const videoElement = React.useRef<HTMLDivElement>(null);
	const player = React.useRef<MediaPlayer>();

	const [paused, setPaused] = React.useState(false);
	const [fullScreen, setFullScreen] = React.useState(false);

	const [reactions, setReactions] = React.useState<Array<React.ReactNode>>([]);

	const onPauseClick: React.MouseEventHandler = React.useCallback(event => {
		event.stopPropagation();
		event.preventDefault();

		const currentPlayer = player.current!;
		paused ? currentPlayer.play() : currentPlayer.pause();
		setPaused(!paused);
	}, [paused]);

	const onFullScreenClick: React.MouseEventHandler = React.useCallback(event => {
		event.stopPropagation();

		fullScreen ?  document.exitFullscreen() : videoElement.current!.requestFullscreen();
	}, [fullScreen]);

	const mediaPlayerScriptLoaded = React.useCallback(() => {
		const mediaPlayerPackage = (window as any).IVSPlayer;

		const playerOverlay = document.getElementById("overlay")!;

		// First, check if the browser supports the Amazon IVS player.
		if (!isPlayerSupported) {
			console.warn("Leider unterstützt dein Browser FAYR TV nicht. Wir empfehlen Google Chrome oder Firefox ;-)");
			return;
		}

		// Initialize player
		const initializedPlayer: MediaPlayer = mediaPlayerPackage.create();
		player.current = initializedPlayer;
		initializedPlayer.attachHTMLVideoElement((document.getElementById("video-player")! as HTMLVideoElement));

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
			if (config.DEBUG) console.log(
			`Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
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
			function (e) {
			playerOverlay.classList.add("overlay--hover");
			},
			false
		);
		
		playerOverlay.addEventListener("mouseout", function (e) {
			playerOverlay.classList.remove("overlay--hover");
		});
	}, []);

	React.useEffect(() => {
		const mediaPlayerScript = document.createElement("script");
		mediaPlayerScript.src = "https://player.live-video.net/1.3.1/amazon-ivs-player.min.js";
		// mediaPlayerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.6/video.min.js";
		mediaPlayerScript.async = true;
		mediaPlayerScript.onload = mediaPlayerScriptLoaded;

		document.body.appendChild(mediaPlayerScript);
	}, []);

	React.useEffect(() => {
		if (!videoElement.current) {
			return;
		}

		const cb = (_: Event) => setFullScreen(x => !x);

		const currentVideoElement = videoElement.current;
		videoElement.current.onfullscreenchange = cb;

		return () => currentVideoElement?.removeEventListener("fullscreenchange", cb);
	}, [videoElement]);

	const { selectedEmoji } = React.useContext(SelectedReactionContext);
	const { socket } = useSocket();

	const onVideoClick: MouseEventHandler = React.useCallback(event => {
		if (!socket || !videoElement.current) {
			return;
		}

		const { height, width } = videoElement.current.getBoundingClientRect();
		const { clientX, clientY } = event;

		const relativeXClick = Number((clientX / width).toFixed(3));
		const relativeYClick = Number((clientY / height).toFixed(3));

		socket.send<EmojiReactionTransferObject>({
			messageType: SocketEventType.EmojiReaction,
			payload: {
				attendeeId,
				emoji: selectedEmoji,
				clickPosition: {
					relativeX: relativeXClick,
					relativeY: relativeYClick,
				}
			},
		});
	}, [socket, selectedEmoji, attendeeId]);
	
	React.useEffect(() => {
		if (!socket || !videoElement.current) {
			return;
		}

		return socket.addListener<EmojiReactionTransferObject>(SocketEventType.EmojiReaction, ({ emoji, clickPosition}) => {

			const { relativeX, relativeY } = clickPosition!;
			const { height, width } = videoElement.current!.getBoundingClientRect();

			const actualTop = (height * relativeY) - 15;
			const actualLeft = (width * relativeX) - 15;

			setReactions(currentReactions => {
				const newReactions = [ ...currentReactions ];

				const key = makeid(8);
				const newReaction = (
					<div 
						key={`${emoji}_${key}`}
						className={styles.Reaction}
						style={{ top: `${actualTop}px`, left: `${actualLeft}px`}}>
						<Emoji 
							text={emoji}/>
					</div>
				);
				
				newReactions.push(newReaction);

				setTimeout(() => {
					setReactions(reactions => reactions.filter(x => x !== newReaction));
				}, 2000);

				return newReactions;
			})

			return Promise.resolve();
		})
	}, [socket]);
	return (
		<div className="player-wrapper">
			<div className="aspect-spacer"></div>
			<div 
				ref={videoElement} 
				className="pos-absolute full-width full-height top-0"
				onClick={onVideoClick}>
				{ fullScreen && (
					<div className="FullScreenCams">
						{ fullScreenCamSection }
					</div>
				)}
				<div id="overlay" className="overlay">
					<div id="player-controls">
					<div className="player-controls__inner">
						<button id="play" className={`mg-x-1 player-btn player-btn--icon ${paused ? "player-btn--pause" : "player-btn--play"}`} onClick={onPauseClick}>
							<svg
								className="player-icon player-icon--play"
								xmlns="http://www.w3.org/2000/svg"
								height="36"
								viewBox="0 0 24 24"
								width="36"
							>
								<path
									d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
								/>
							</svg>
							<svg
								className="player-icon player-icon--pause"
								xmlns="http://www.w3.org/2000/svg"
								height="36"
								viewBox="0 0 24 24"
								width="36"
							>
								<path
									d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"
								/>
							</svg>
						</button>
						<StreamVolumeControl 
							player={player.current}/>
						<button id="fullscreen" className="mg-x-1 player-btn player-btn--icon" onClick={onFullScreenClick}>
							<svg 
								className="player-icon"
								xmlns="http://www.w3.org/2000/svg" 
								viewBox="0 0 512 512" 
								height="36" 
								width="36" >
								<path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" 
									d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"
								/>
							</svg>
						</button>
					</div>
					</div>
				</div>
				<video id="video-player" className="el-player" playsInline></video>
				{ reactions }
			</div>
		</div>
	  );
}

export default VideoPlayer;
