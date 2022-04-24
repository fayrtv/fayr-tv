// Framework
import classNames from "classnames";
import * as React from "react";
import { isInRect } from "util/coordinateUtil";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";

// Styles
import styles from "./ModalSettingsView.module.scss";

import SettingsView from "./SettingsView";

export const ModalSettingsView = (props: React.ComponentProps<typeof SettingsView>) => {
    const settingsDialogRef = React.useRef<HTMLDivElement>(null);

    useGlobalKeyHandler("Escape", props.onCancel);

    const handleSettingsClick: React.MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        if (!settingsDialogRef.current) {
            return;
        }

        if (
            !isInRect(
                settingsDialogRef.current!.getBoundingClientRect(),
                clickEvent.clientX,
                clickEvent.clientY,
            )
        ) {
            props.onCancel();
        }
    };

    return (
        <div
            className={classNames(
                "modal pos-absolute top-0 bottom-0 grid place-items",
                styles.SettingsContainer,
            )}
            onClick={handleSettingsClick}
        >
            <SettingsView {...props} ref={settingsDialogRef} />
        </div>
    );
};

export default ModalSettingsView;
