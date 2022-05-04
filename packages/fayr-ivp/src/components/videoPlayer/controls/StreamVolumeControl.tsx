/* eslint-disable react-hooks/exhaustive-deps */
// Framework
import { MediaPlayer } from "amazon-ivs-player";
import classNames from "classnames";
import * as React from "react";
// Functionality
import { useMediaQuery } from "react-responsive";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";

// Styles
import styles from "./StreamVolumeControl.module.scss";

import { ButtonPopupExpansionDirection } from "../types";

const RAIL_BG_COLOR = "#707070";
const RAIL_GRADIENT_COLOR = "#D2D2D2";
const RAIL_VALUE_COLOR = "#D2D2D2";

type Props = {
    player: MediaPlayer | undefined;
    expansionDirection?: ButtonPopupExpansionDirection;
};

export const StreamVolumeControl = ({
    player,
    expansionDirection = ButtonPopupExpansionDirection.Downwards,
}: Props) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const pinRef = React.useRef<HTMLSpanElement>(null);
    const railRef = React.useRef<HTMLDivElement>(null);

    const [muted, setMuted] = React.useState(false);
    const [volumeRatio, setVolumeRatio] = React.useState(0);

    const isMobile = useMediaQuery({ maxWidth: 960 });

    React.useEffect(() => {
        if (!player) {
            return;
        }

        setVolumeRatio(player.getVolume());
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
                    setVolumeRatio(0);
                } else {
                    setVolumeRatio(player.getVolume());
                }
            }
        },
        [muted, player],
    );

    const setVolume = (percentage: number) => {
        setVolumeRatio(percentage);
        player?.setVolume(percentage);

        if (player?.isMuted()) {
            player.setMuted(false);
        }
    };

    const convertClickToVolume = (y: number, railRef: HTMLDivElement) => {
        const { height, top } = railRef.getBoundingClientRect();

        let percentage = 1 - (y - top) / height;

        if (percentage < 0) {
            percentage = 0;
        } else if (percentage > 1) {
            percentage = 1;
        }

        setVolume(percentage);
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

    const onButtonUp = React.useCallback(() => {
        if (!player) {
            return;
        }

        const currentVol = player.getVolume();
        const newVol = currentVol + 0.1;

        player.setVolume(newVol > 1 ? 1 : newVol);
    }, [player]);
    useGlobalKeyHandler("ArrowUp", onButtonUp);

    const onButtonDown = React.useCallback(() => {
        if (!player) {
            return;
        }

        const currentVol = player.getVolume();
        const newVol = currentVol - 0.1;

        player.setVolume(newVol < 0 ? 0 : newVol);
    }, [player]);
    useGlobalKeyHandler("ArrowDown", onButtonDown);

    const volumePercentage = volumeRatio * 100;

    const sliderStyle = {
        backgroundImage: `linear-gradient(0, ${RAIL_VALUE_COLOR} ${volumePercentage /
            3}%, ${RAIL_GRADIENT_COLOR} ${volumePercentage}%, ${RAIL_BG_COLOR} ${volumePercentage}%)`,
    };
    return (
        <div
            className={`mg-x-1 player-btn player-btn--icon ${
                muted || volumeRatio === 0 ? "player-btn--mute" : "player-btn--unmute"
            } ${styles.StreamVolumeControl}`}
            onClick={onMuteClick}
        >
            <svg
                className="icon player-icon player-icon--volume_up"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
            >
                {/* <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" /> */}
                <path d="M 1.7070312 0.29296875 L 0.29296875 1.7070312 L 28.292969 29.707031 L 29.707031 28.292969 L 26.992188 25.578125 C 28.963279 22.474938 30 18.937386 30 15.255859 C 30 10.870859 28.47975 6.5658594 25.71875 3.1308594 C 25.37275 2.7018594 24.7425 2.6335156 24.3125 2.9785156 C 23.8815 3.3245156 23.814156 3.9547656 24.160156 4.3847656 C 26.672156 7.5087656 28 11.268859 28 15.255859 C 28 18.403042 27.145366 21.431087 25.533203 24.119141 L 22.714844 21.300781 C 23.559515 19.406077 24 17.357926 24 15.255859 C 24 11.896859 22.8975 8.7109687 20.8125 6.0429688 C 20.4715 5.6079688 19.843203 5.5301406 19.408203 5.8691406 C 18.973203 6.2091406 18.896328 6.8384375 19.236328 7.2734375 C 21.043328 9.5864375 22 12.346859 22 15.255859 C 22 16.810435 21.713763 18.328655 21.175781 19.761719 L 17.902344 16.488281 C 17.959493 16.080699 18 15.670252 18 15.255859 C 18 12.888859 17.094219 10.635156 15.449219 8.9101562 C 15.067219 8.5111562 14.435156 8.4959531 14.035156 8.8769531 C 13.636156 9.2579531 13.619953 9.8920156 14.001953 10.291016 C 15.125251 11.469258 15.808365 12.960725 15.964844 14.550781 L 11 9.5859375 L 11 7 L 9.6738281 8.2597656 L 1.7070312 0.29296875 z M 3 11 C 1.343 11 0 12.343 0 14 L 0 16 C 0 17.657 1.343 19 3 19 L 6.7949219 19 L 11 23 L 11 15.21875 L 6.78125 11 L 3 11 z M 14.865234 19.085938 C 14.712234 19.327938 14.564813 19.572875 14.382812 19.796875 C 14.034812 20.224875 14.098344 20.855125 14.527344 21.203125 C 14.713344 21.354125 14.936203 21.427734 15.158203 21.427734 C 15.449203 21.427734 15.736594 21.301594 15.933594 21.058594 C 16.070594 20.890594 16.196312 20.715063 16.320312 20.539062 L 14.865234 19.085938 z" />
            </svg>
            <svg
                className="icon player-icon player-icon--volume_off"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
            >
                {/* <path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" /> */}
                <path d="M 24.939453 2.7460938 A 1.0001 1.0001 0 0 0 24.160156 4.3847656 C 26.558398 7.3678979 28 11.139729 28 15.255859 C 28 19.153774 26.697579 22.735437 24.521484 25.642578 A 1.0003912 1.0003912 0 1 0 26.123047 26.841797 C 28.542952 23.608938 30 19.599944 30 15.255859 C 30 10.67199 28.388509 6.4517271 25.71875 3.1308594 A 1.0001 1.0001 0 0 0 24.939453 2.7460938 z M 20.037109 5.6464844 A 1.0001 1.0001 0 0 0 19.236328 7.2734375 C 20.963426 9.4832305 22 12.243759 22 15.255859 C 22 18.055119 21.105815 20.636923 19.59375 22.763672 A 1.0001 1.0001 0 1 0 21.222656 23.921875 C 22.962591 21.474623 24 18.4826 24 15.255859 C 24 11.78396 22.799402 8.5851757 20.8125 6.0429688 A 1.0001 1.0001 0 0 0 20.037109 5.6464844 z M 11 7 L 6.7929688 11 L 3 11 C 1.343 11 0 12.343 0 14 L 0 16 C 0 17.657 1.343 19 3 19 L 6.7929688 19 L 11 23 L 11 7 z M 14.738281 8.5917969 A 1.0001 1.0001 0 0 0 14.001953 10.291016 C 15.239451 11.587484 16 13.328154 16 15.255859 C 16 16.979025 15.392559 18.553804 14.380859 19.796875 A 1.0001 1.0001 0 1 0 15.931641 21.058594 C 17.219941 19.475665 18 17.450694 18 15.255859 C 18 12.799565 17.023721 10.559688 15.449219 8.9101562 A 1.0001 1.0001 0 0 0 14.738281 8.5917969 z" />
            </svg>
            <div
                className={classNames(styles.SliderContainer, {
                    [styles.Upwards]: expansionDirection === ButtonPopupExpansionDirection.Upwards,
                    [styles.Downwards]:
                        expansionDirection === ButtonPopupExpansionDirection.Downwards,
                })}
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
                <div className={styles.SliderRail} ref={railRef} style={sliderStyle}>
                    <span
                        className={styles.SliderPin}
                        style={{ bottom: `calc(${volumeRatio * 100}% - 8px)` }}
                        ref={pinRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default StreamVolumeControl;
