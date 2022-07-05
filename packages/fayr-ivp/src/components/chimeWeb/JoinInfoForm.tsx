import classNames from "classnames";
import React, { MouseEventHandler } from "react";

import { useIsMobile } from "components/mediaQueries";

import { isFalsyOrWhitespace } from "@fayr/common";

import styles from "./JoinInfoForm.module.scss";

type Props = {
    username: string;
    onUsernameChanged: React.Dispatch<string>;
    roomTitle: string;
    onRoomTitleChanged: React.Dispatch<string>;
    onSubmit: MouseEventHandler;
    disableSubmit?: boolean;
    usernameInputRef?: React.Ref<HTMLInputElement>;
    roomTitleInputRef?: React.Ref<HTMLInputElement>;
};

export function JoinInfoForm({
    username,
    onUsernameChanged,
    roomTitle,
    onSubmit,
    usernameInputRef,
    roomTitleInputRef,
    disableSubmit = false,
}: Props) {
    const isMobile = useIsMobile();

    const isValid = !isFalsyOrWhitespace(roomTitle) && !isFalsyOrWhitespace(username);

    const setUsername = (newValue: string) => onUsernameChanged(newValue);

    return (
        <form action="">
            <fieldset className={classNames(styles.JoinInfoForm, { [styles.Mobile]: isMobile })}>
                <div>
                    <div className={styles.BannerStripe}>
                        <img src={require("../../assets/vfb-logo.png")} alt="VfB Banner" className={styles.Banner} />
                    </div>
                    <div className={styles.JoinInfoFormControls}>
                        <div
                            style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                                color: "var(--color-gray)",
                                textDecoration: "underline",
                                textAlign: "center",
                            }}
                        >
                            Wie funktioniert das?
                        </div>
                        <input
                            ref={usernameInputRef}
                            type="text"
                            placeholder="Dein Name"
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                        />
                        <button
                            className="btn btn--secondary"
                            disabled={!isValid || disableSubmit}
                            onClick={onSubmit}
                        >
                            STARTEN
                        </button>
                    </div>
                </div>
                {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
            </fieldset>
        </form>
    );
}
