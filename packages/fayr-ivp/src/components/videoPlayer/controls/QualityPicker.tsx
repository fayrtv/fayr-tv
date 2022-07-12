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
    expansionDirection?: ButtonPopupExpansionDirection;
};

export default function QualityPicker({
    player,
    expansionDirection = ButtonPopupExpansionDirection.Downwards,
}: Props) {
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
        (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, quality: Quality, isHQ: boolean) => {
            event.stopPropagation();

            if (!!player) {
                player.setQuality(quality);
                setCurrentQuality(isHQ ? `${quality.name} (HQ)` : quality.name);
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

    return currentQuality === "unknown" ? (
        <></>
    ) : (
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
                        [styles.Upwards]:
                            expansionDirection === ButtonPopupExpansionDirection.Upwards,
                        [styles.Downwards]:
                            expansionDirection === ButtonPopupExpansionDirection.Downwards,
                    })}
                    direction="Column"
                >
                    {availableQualities.length === 0 || availableQualities[0].name === "unknown"
                        ? tl.NoQualitySettingsAvailable
                        : availableQualities.map((x, n) => {
                              const isHQ = availableQualities[n + 1]?.name === x.name;
                              return (
                                  <span
                                      key={x.name + x.bitrate}
                                      onClick={(event) => onQualityClick(event, x, isHQ)}
                                  >
                                      {isHQ ? `${x.name} (HQ)` : x.name}
                                  </span>
                              );
                          })}
                </Flex>
            )}
        </button>
    );
}
