// Framework
import { MediaPlayer, Quality } from "amazon-ivs-player";
import classNames from "classnames";
import React from "react";
import { isInRect } from "util/coordinateUtil";

// Functionality
import useGlobalClickHandler from "hooks/useGlobalClickHandler";

// Components
import { Flex } from "@fayr/shared-components";

// Styles
import styles from "./QualityPicker.module.scss";

import useTranslations from "../../../hooks/useTranslations";

type Props = {
    player: MediaPlayer | undefined;
};

export default function QualityPicker({ player }: Props) {
    const [availableQualities, setAvailableQualities] = React.useState<Array<Quality>>([]);
    const [showQualitySettings, setShowQualitySettings] = React.useState(false);
    const qualityPickerRef = React.useRef<HTMLDivElement>(null);
    const tl = useTranslations();

    const onQualityWheelClick: React.MouseEventHandler = React.useCallback((event) => {
        event.stopPropagation();
        setShowQualitySettings((current) => !current);
    }, []);

    const onQualityClick = React.useCallback(
        (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, quality: Quality) => {
            event.stopPropagation();

            player?.setQuality(quality);

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

    React.useEffect(() => setAvailableQualities(player?.getQualities() ?? []), [player]);

    return (
        <button
            id="settings"
            className={classNames(
                "mg-x-1 player-btn player-btn--icon",
                styles.QualitySettingsButton,
            )}
            onClick={onQualityWheelClick}
        >
            <svg
                className={classNames("icon", styles.Icon, {
                    [styles.Open]: showQualitySettings,
                })}
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="m0 0h24v24h-24z" fill="none" />
                <path d="m19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65c-.03-.24-.24-.42-.49-.42h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>

            {showQualitySettings && availableQualities && (
                <Flex ref={qualityPickerRef} className={styles.Options} direction="Column">
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
