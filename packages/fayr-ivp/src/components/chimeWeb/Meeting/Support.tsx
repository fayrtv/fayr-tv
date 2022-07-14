import classNames from "classnames";
import React from "react";
import { isInRect } from "util/coordinateUtil";

import useTranslations from "hooks/useTranslations";

import { Cell, Grid } from "@fayr/common";

import styles from "./Support.module.scss";

type Props = {
    onCancel(): void;
};

export const ShareInvite = ({ onCancel }: Props) => {
    const tl = useTranslations();
    const shareInviteRef = React.useRef<HTMLDivElement>(null);

    const onContainerClick: React.MouseEventHandler<HTMLDivElement> = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        if (!shareInviteRef.current) {
            return;
        }

        const rect = shareInviteRef.current!.getBoundingClientRect();

        if (!isInRect(rect, clickEvent.clientX, clickEvent.clientY)) {
            onCancel();
        }
    };

    return (
        <div className={styles.SupportContainer}>
            <div
                className={classNames(styles.Support, "lg:w-1/3 lg:h-1/3")}
                ref={shareInviteRef}
                onClick={onContainerClick}
            >
                <Grid
                    className="h-full w-full"
                    gridProperties={{
                        gridTemplateAreas: `
						'Header .' 
						'Content .'
						'. Close'
					`,
                        gap: "1rem",
                        gridTemplateColumns: "80% 20%",
                        gridTemplateRows: "20% 60% 20%",
                    }}
                >
                    <Cell gridArea="Header">
                        <h1 style={{ color: "#ffffff" }}>Support</h1>
                    </Cell>
                    <Cell gridArea="Content">
                        <p style={{ fontSize: "1.2em" }}>
                            Falls du Probleme hast oder Hilfe benötigst, schreibe eine kurze
                            Nachricht an
                            <br />
                            <a
                                style={{ color: "#D30029", userSelect: "all" }}
                                href="mailto:service@vfb-stuttgart.de"
                            >
                                service@vfb-stuttgart.de
                            </a>
                            <br />
                            <br />
                            Ein Mitarbeiter wird sich dann direkt bei dir melden, um dir zu helfen.
                        </p>
                    </Cell>
                    <Cell gridArea="Close">
                        <span className={styles.CloseButton} onClick={onCancel}>
                            {tl.Close}
                        </span>
                    </Cell>
                </Grid>
            </div>
        </div>
    );
};

export default ShareInvite;
