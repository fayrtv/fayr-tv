// Styles
import classNames from "classnames";

import styles from "./ToggleButton.module.scss";

import useTranslations from "../../../../hooks/useTranslations";

type Props = {
    enabled: boolean;
    forceMuted?: boolean;
    onClick(): void | Promise<void>;
};

export const MicrophoneToggle = ({ enabled, forceMuted = false, onClick }: Props) => {
    const tl = useTranslations();

    return (
        <div
            key="MicButton"
            className={classNames("btn rounded", styles.Button, {
                [styles.Active]: enabled,
                [styles.NotAllowed]: forceMuted,
            })}
            title={forceMuted ? tl.MicToggle_ForceMuted : tl.MicToggle_Enable}
            onClick={
                forceMuted
                    ? void 0
                    : (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onClick();
                      }
            }
        >
            {enabled ? (
                <svg
                    className={styles.BtnSvg}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                >
                    <path
                        d="M 15 2 C 13.3 2 12 3.3 12 5 L 12 17 C 12 18.7 13.3 20 15 20 C 16.7 20 18 18.7 18 17 L 18 5 C 18 3.3 16.7 2 15 2 z M 8.984375 11.986328 A 1.0001 1.0001 0 0 0 8 13 L 8 17 C 8 20.491618 10.642769 23.288705 14 23.796875 L 14 26 L 11 26 A 1.0001 1.0001 0 1 0 11 28 L 19 28 A 1.0001 1.0001 0 1 0 19 26 L 16 26 L 16 23.796875 C 19.357231 23.288705 22 20.491618 22 17 L 22 13 A 1.0001 1.0001 0 1 0 20 13 L 20 17 C 20 19.735124 17.782598 21.956926 15.054688 21.988281 A 1.0001 1.0001 0 0 0 14.943359 21.988281 C 12.216362 21.955864 10 19.734459 10 17 L 10 13 A 1.0001 1.0001 0 0 0 8.984375 11.986328 z"
                        fill="#07090C"
                    />
                </svg>
            ) : (
                <svg
                    className={styles.BtnSvg}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                >
                    <path
                        d="M 15 2 C 13.343 2 12 3.343 12 5 L 12 17 C 12 18.499 13.102063 19.730125 14.539062 19.953125 C 15.196063 18.130125 16.416 16.577578 18 15.517578 L 18 5 C 18 3.343 16.657 2 15 2 z M 9 12 C 8.448 12 8 12.447 8 13 L 8 17 C 8 20.519 10.613 23.431922 14 23.919922 L 14 26 L 11 26 C 10.448 26 10 26.447 10 27 C 10 27.553 10.448 28 11 28 L 15.517578 28 C 14.559578 26.57 14 24.851 14 23 C 14 22.629 14.028266 22.26525 14.072266 21.90625 C 11.758266 21.46925 10 19.439 10 17 L 10 13 C 10 12.447 9.552 12 9 12 z M 21 12 C 20.448 12 20 12.447 20 13 L 20 14.523438 C 20.638 14.297438 21.305 14.135594 22 14.058594 L 22 13 C 22 12.447 21.552 12 21 12 z M 23 16 C 19.14 16 16 19.14 16 23 C 16 26.86 19.14 30 23 30 C 26.86 30 30 26.86 30 23 C 30 19.14 26.86 16 23 16 z M 23 18 C 24.017 18 24.962906 18.308031 25.753906 18.832031 L 18.832031 25.753906 C 18.308031 24.962906 18 24.017 18 23 C 18 20.243 20.243 18 23 18 z M 27.167969 20.246094 C 27.691969 21.037094 28 21.983 28 23 C 28 25.757 25.757 28 23 28 C 21.983 28 21.037094 27.691969 20.246094 27.167969 L 27.167969 20.246094 z"
                        fill="#D2D2D2"
                    />
                </svg>
            )}
        </div>
    );
};

export default MicrophoneToggle;
