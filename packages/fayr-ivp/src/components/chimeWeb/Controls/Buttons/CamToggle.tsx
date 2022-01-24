// Styles
import classNames from "classnames";

import { VideoStatus } from "components/chimeWeb/Controls/Controls";

import { LoadingAnimation } from "@fayr/shared-components";

import styles from "./ToggleButton.module.scss";

type Props = {
    toggleState: VideoStatus;
    onClick(): void | Promise<void>;
};

export const CamToggle = ({ toggleState, onClick }: Props) => {
    return (
        <div
            key="CamButton"
            className={classNames("btn rounded", styles.Button, {
                [styles.Active]: toggleState === VideoStatus.Enabled,
            })}
            onClick={onClick}
            title="Kamera einschalten"
        >
            {toggleState === VideoStatus.Enabled ? (
                <svg
                    className={styles.BtnSvg}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                >
                    <path
                        d="M 2 6 C 0.895 6 0 6.895 0 8 L 0 22 C 0 23.105 0.895 24 2 24 L 19 24 C 20.105 24 21 23.105 21 22 L 21 8 C 21 6.895 20.105 6 19 6 L 2 6 z M 29 8 A 1 1 0 0 0 28.302734 8.2832031 L 23 13 L 23 15 L 23 17 L 28.324219 21.736328 L 28.339844 21.75 A 1 1 0 0 0 29 22 A 1 1 0 0 0 30 21 L 30 15 L 30 9 A 1 1 0 0 0 29 8 z"
                        fill="#07090C"
                    />
                </svg>
            ) : toggleState === VideoStatus.Disabled ? (
                <svg
                    className={styles.BtnSvg}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                >
                    <path
                        d="M 1.7070312 0.29296875 L 0.29296875 1.7070312 L 28.292969 29.707031 L 29.707031 28.292969 L 21 19.585938 L 21 8 C 21 6.895 20.105 6 19 6 L 7.4140625 6 L 1.7070312 0.29296875 z M 1.859375 6.0136719 C 0.821375 6.0866719 -1.4802974e-16 6.943 0 8 L 0 22 C 0 23.105 0.895 24 2 24 L 19 24 C 19.251 24 19.489938 23.947281 19.710938 23.863281 L 1.859375 6.0136719 z M 29 8 A 1 1 0 0 0 28.302734 8.2832031 L 23 13 L 23 15 L 23 17 L 28.339844 21.75 A 1 1 0 0 0 29 22 A 1 1 0 0 0 30 21 L 30 15 L 30 9 A 1 1 0 0 0 29 8 z"
                        fill="#D2D2D2"
                    />
                </svg>
            ) : (
                <LoadingAnimation />
            )}
        </div>
    );
};

export default CamToggle;
