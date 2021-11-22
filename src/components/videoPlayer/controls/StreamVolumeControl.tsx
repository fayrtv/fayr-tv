/* eslint-disable react-hooks/exhaustive-deps */
// Framework
import * as React from "react";
import { MediaPlayer } from "amazon-ivs-player";

// Functionality
import { useMediaQuery } from "react-responsive";

// Styles
import styles from "./StreamVolumeControl.module.scss";

type Props = {
    player: MediaPlayer | undefined;
};

export const StreamVolumeControl = ({ player }: Props) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const pinRef = React.useRef<HTMLSpanElement>(null);
    const railRef = React.useRef<HTMLDivElement>(null);

    const [muted, setMuted] = React.useState(false);
    const [volumePercentage, setVolumePercentage] = React.useState(0);

    const isMobile = useMediaQuery({ maxWidth: 960 });

    React.useEffect(() => {
        if (!player) {
            return;
        }

        setVolumePercentage(player.getVolume());
    }, [player?.getVolume() ?? undefined, railRef.current]);

    const onMuteClick: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (player) {
                const newMuteState = !muted;
                player.setMuted(newMuteState);
                setMuted(newMuteState);

                if (newMuteState) {
                    setVolumePercentage(0);
                } else {
                    setVolumePercentage(player.getVolume());
                }
            }
        },
        [muted, player],
    );

    const convertClickToVolume = (y: number, railRef: HTMLDivElement) => {
        const { height, top } = railRef.getBoundingClientRect();

        let percentage = 1 - (y - top) / height;

        if (percentage < 0) {
            percentage = 0;
        } else if (percentage > 1) {
            percentage = 1;
        }

        setVolumePercentage(percentage);
        player?.setVolume(percentage);

        if (player?.isMuted()) {
            player.setMuted(false);
        }
    };

    React.useEffect(() => {
        if (!railRef.current || !pinRef.current || !containerRef.current) {
            return;
        }

        const localRailRef = railRef.current;
        const localPinRef = pinRef.current;
        const localContainerRef = containerRef.current;

        let trackMouseMove = false;

        const onMouseDown = (event: MouseEvent | TouchEvent) => {
            event.stopPropagation();
            event.preventDefault();
            trackMouseMove = true;
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!trackMouseMove) {
                return;
            }

            convertClickToVolume(event.y, localRailRef);
        };

        const onTouchMove = (event: TouchEvent) => {
            if (!trackMouseMove) {
                return;
            }

            convertClickToVolume(event.touches[0].clientY, localRailRef);
        };

        const onMouseUp = () => (trackMouseMove = false);
        const onMouseLeave = () => (trackMouseMove = false);

        // Only listen when the pin is dragged
        localPinRef.addEventListener(isMobile ? "touchstart" : "mousedown", onMouseDown);
        localPinRef.addEventListener(isMobile ? "touchend" : "mouseup", onMouseUp);

        // Mouse moves should not only be registered on the slider, but also the container.
        // Still, we only apply the rail position. This feels nicer
        if (isMobile) {
            localContainerRef.addEventListener("touchmove", onTouchMove);
        } else {
            localContainerRef.addEventListener("mousemove", onMouseMove);
        }

        // The event should persist until the container is left
        localContainerRef.addEventListener("mouseleave", onMouseLeave);

        // Allow direct clicks on the rail
        const onRailMouseDown = (event: MouseEvent) => convertClickToVolume(event.y, localRailRef);
        localRailRef.addEventListener("mousedown", onRailMouseDown);

        return () => {
            localPinRef.removeEventListener(isMobile ? "touchstart" : "mousedown", onMouseDown);
            localPinRef.removeEventListener(isMobile ? "touchend" : "mouseup", onMouseUp);
            localContainerRef.removeEventListener("mouseleave", onMouseLeave);

            if (isMobile) {
                localContainerRef.removeEventListener("touchmove", onTouchMove);
            } else {
                localContainerRef.removeEventListener("mousemove", onMouseMove);
            }

            localRailRef.removeEventListener("mousedown", onRailMouseDown);
        };
    }, [muted, player, railRef, pinRef, isMobile]);

    const { height } = railRef.current?.getBoundingClientRect() ?? { height: 0 };

    return (
        <div
            className={`mg-x-1 player-btn player-btn--icon ${
                muted || volumePercentage === 0 ? "player-btn--mute" : "player-btn--unmute"
            } ${styles.StreamVolumeControl}`}
            onClick={onMuteClick}
        >
            <svg
                className="player-icon player-icon--volume_up"
                xmlns="http://www.w3.org/2000/svg"
                height="36"
                viewBox="0 0 24 24"
                width="36"
            >
                <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
            </svg>
            <svg
                className="player-icon player-icon--volume_off"
                xmlns="http://www.w3.org/2000/svg"
                height="36"
                viewBox="0 0 24 24"
                width="36"
            >
                <path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
            </svg>
            <div
                className={styles.SliderContainer}
                ref={containerRef}
                onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                onMouseDown={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
            >
                <div className={styles.SliderRail} ref={railRef}>
                    <span
                        className={styles.SliderPin}
                        style={{ bottom: `${Number(volumePercentage * height) - 8}px` }}
                        ref={pinRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default StreamVolumeControl;
