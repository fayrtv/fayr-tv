import React from "react";
import { MediaPlayer, PlayerState, PlayerEventType, isPlayerSupported } from 'amazon-ivs-player';
import * as config from "../../config";

type Props = {
	videoStream: string;
}

const VideoPlayer = ({ videoStream }: Props) => {

	const videoElement = React.useRef<HTMLVideoElement>(null);
	const player = React.useRef<MediaPlayer>();

	const [paused, setPaused] = React.useState(false);
	const [muted, setMuted] = React.useState(false);
	const [fullScreen, setFullScreen] = React.useState(false);

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
			debugger;
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

	const onPauseClick = React.useCallback(() => {
		const currentPlayer = player.current!;
		paused ? currentPlayer.play() : currentPlayer.pause();
		setPaused(!paused);
	}, [paused]);

	const onMuteClick = React.useCallback(() => {
		const newMuteState = !muted;
		player.current!.setMuted(newMuteState);
		setMuted(newMuteState);
	}, [muted]);

	const onFullScreenClick = React.useCallback(() => {
		videoElement.current!.requestFullscreen();
	}, [fullScreen]);

	React.useEffect(() => {        
		const mediaPlayerScript = document.createElement("script");
		mediaPlayerScript.src = "https://player.live-video.net/1.3.1/amazon-ivs-player.min.js";
		// mediaPlayerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/video.js/7.6.6/video.min.js";
		mediaPlayerScript.async = true;
		mediaPlayerScript.onload = () => mediaPlayerScriptLoaded();
		document.body.appendChild(mediaPlayerScript);
	})

	return (
		<div className="player-wrapper">
			<div className="aspect-spacer"></div>
			<div className="pos-absolute full-width full-height top-0">
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
						<button id="mute" className={`mg-x-1 player-btn player-btn--icon ${muted ? "player-btn--mute" : "player-btn--unmute"}`} onClick={onMuteClick}>
							<svg
								className="player-icon player-icon--volume_up"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
							>
								<path
									d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"
								/>
							</svg>
							<svg
								className="player-icon player-icon--volume_off"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
							>
								<path
									d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"
								/>
							</svg>
						</button>
						<button id="fullscreen" className="mg-x-1 player-btn player-btn--icon player-btn--unmute" onClick={onFullScreenClick}>
							<svg
								className="player-icon player-icon--volume_up"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
							>
								<path d="M384.97,12.03c0-6.713-5.317-12.03-12.03-12.03H264.847c-6.833,0-11.922,5.39-11.934,12.223
									c0,6.821,5.101,11.838,11.934,11.838h96.062l-0.193,96.519c0,6.833,5.197,12.03,12.03,12.03c6.833-0.012,12.03-5.197,12.03-12.03
									l0.193-108.369c0-0.036-0.012-0.06-0.012-0.084C384.958,12.09,384.97,12.066,384.97,12.03z"/>
								<path d="M120.496,0H12.403c-0.036,0-0.06,0.012-0.096,0.012C12.283,0.012,12.247,0,12.223,0C5.51,0,0.192,5.317,0.192,12.03
									L0,120.399c0,6.833,5.39,11.934,12.223,11.934c6.821,0,11.838-5.101,11.838-11.934l0.192-96.339h96.242
									c6.833,0,12.03-5.197,12.03-12.03C132.514,5.197,127.317,0,120.496,0z"/>
								<path d="M120.123,360.909H24.061v-96.242c0-6.833-5.197-12.03-12.03-12.03S0,257.833,0,264.667v108.092
									c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096c0,6.713,5.317,12.03,12.03,12.03h108.092
									c6.833,0,11.922-5.39,11.934-12.223C132.057,365.926,126.956,360.909,120.123,360.909z"/>
								<path d="M372.747,252.913c-6.833,0-11.85,5.101-11.838,11.934v96.062h-96.242c-6.833,0-12.03,5.197-12.03,12.03
									s5.197,12.03,12.03,12.03h108.092c0.036,0,0.06-0.012,0.084-0.012c0.036-0.012,0.06,0.012,0.096,0.012
									c6.713,0,12.03-5.317,12.03-12.03V264.847C384.97,258.014,379.58,252.913,372.747,252.913z"/>
							</svg>
							<svg
								className="player-icon player-icon--volume_off"
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 0 24 24"
								width="24"
							>
								<path d="M384.97,12.03c0-6.713-5.317-12.03-12.03-12.03H264.847c-6.833,0-11.922,5.39-11.934,12.223
									c0,6.821,5.101,11.838,11.934,11.838h96.062l-0.193,96.519c0,6.833,5.197,12.03,12.03,12.03c6.833-0.012,12.03-5.197,12.03-12.03
									l0.193-108.369c0-0.036-0.012-0.06-0.012-0.084C384.958,12.09,384.97,12.066,384.97,12.03z"/>
								<path d="M120.496,0H12.403c-0.036,0-0.06,0.012-0.096,0.012C12.283,0.012,12.247,0,12.223,0C5.51,0,0.192,5.317,0.192,12.03
									L0,120.399c0,6.833,5.39,11.934,12.223,11.934c6.821,0,11.838-5.101,11.838-11.934l0.192-96.339h96.242
									c6.833,0,12.03-5.197,12.03-12.03C132.514,5.197,127.317,0,120.496,0z"/>
								<path d="M120.123,360.909H24.061v-96.242c0-6.833-5.197-12.03-12.03-12.03S0,257.833,0,264.667v108.092
									c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096c0,6.713,5.317,12.03,12.03,12.03h108.092
									c6.833,0,11.922-5.39,11.934-12.223C132.057,365.926,126.956,360.909,120.123,360.909z"/>
								<path d="M372.747,252.913c-6.833,0-11.85,5.101-11.838,11.934v96.062h-96.242c-6.833,0-12.03,5.197-12.03,12.03
									s5.197,12.03,12.03,12.03h108.092c0.036,0,0.06-0.012,0.084-0.012c0.036-0.012,0.06,0.012,0.096,0.012
									c6.713,0,12.03-5.317,12.03-12.03V264.847C384.97,258.014,379.58,252.913,372.747,252.913z"/>
							</svg>
						</button>
					</div>
					</div>
				</div>
				<video id="video-player" className="el-player" ref={videoElement} playsInline></video>
			</div>
		</div>
	  );
}

export default VideoPlayer;
