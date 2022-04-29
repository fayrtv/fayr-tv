// Framework
import { MediaPlayer, Quality, PlayerState } from "amazon-ivs-player";
import classNames from "classnames";
import React from "react";
import { isInRect } from "util/coordinateUtil";

// Functionality
import useGlobalClickHandler from "hooks/useGlobalClickHandler";

// Components
import { Flex } from "@fayr/common";

// Styles
import styles from "./QualityPicker.module.scss";

import useTranslations from "../../../hooks/useTranslations";
import { ButtonPopupExpansionDirection } from "../types";

type Props = {
    player: MediaPlayer | undefined;
    expansionDirection?: keyof typeof ButtonPopupExpansionDirection;
};

export default function QualityPicker({ player, expansionDirection = "Downwards" }: Props) {
    const [availableQualities, setAvailableQualities] = React.useState<Array<Quality>>([]);
    const [currentQuality, setCurrentQuality] = React.useState<string>("");
    const [showQualitySettings, setShowQualitySettings] = React.useState(false);
    const qualityPickerRef = React.useRef<HTMLDivElement>(null);
    const tl = useTranslations();

    const onQualityWheelClick: React.MouseEventHandler = React.useCallback(
        (event) => {
            event.stopPropagation();
            setAvailableQualities(player?.getQualities() ?? []);
            setShowQualitySettings((current) => !current);
        },
        [player],
    );

    const onQualityClick = React.useCallback(
        (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, quality: Quality) => {
            event.stopPropagation();

            if (!!player) {
                player.setQuality(quality);
                setCurrentQuality(quality.name);
            }

            setShowQualitySettings(false);
        },
        [player],
    );

    useGlobalClickHandler((clickEvent) => {
        if (!showQualitySettings && !qualityPickerRef.current) {
            return;
        }

        if (
            !isInRect(qualityPickerRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)
        ) {
            clickEvent.stopPropagation();
            setShowQualitySettings(false);
        }
    });

    React.useEffect(() => {
        if (!player || currentQuality !== "") {
            return;
        }

        const onReady = () => {
            setCurrentQuality(player.getQuality().name);
            player.removeEventListener(PlayerState.READY, onReady);
        };

        player.addEventListener(PlayerState.READY, onReady);
    }, [currentQuality, player]);

    return (
        <button
            id="settings"
            className={classNames(
                "mg-x-1 player-btn player-btn--icon",
                styles.QualitySettingsButton,
            )}
            onClick={onQualityWheelClick}
        >
            <span>{currentQuality}</span>

            {showQualitySettings && availableQualities && (
                <Flex
                    ref={qualityPickerRef}
                    className={classNames(styles.Options, {
                        [styles.Upwards]: expansionDirection === "Upwards",
                        [styles.Downwards]: expansionDirection === "Downwards",
                    })}
                    direction="Column"
                >
                    {availableQualities.length === 0 || availableQualities[0].name === "unknown"
                        ? tl.NoQualitySettingsAvailable
                        : availableQualities.map((x) => (
                              <span key={x.name} onClick={(event) => onQualityClick(event, x)}>
                                  {x.name}
                              </span>
                          ))}
                </Flex>
            )}
        </button>
    );
}
