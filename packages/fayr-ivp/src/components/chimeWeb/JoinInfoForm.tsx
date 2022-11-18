import classNames from "classnames";
import { VFB_STREAM_TIMINGS } from "config";
import React, { MouseEventHandler, useState } from "react";
import { useTimedFeatureToggle } from "util/dateUtil";

import { useIsMobile } from "components/mediaQueries";

import { isFalsyOrWhitespace } from "@fayr/common";

import styles from "./JoinInfoForm.module.scss";

type Props = {
    onHowItWorksClicked: () => void;
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
    onHowItWorksClicked,
    username,
    onUsernameChanged,
    roomTitle,
    onRoomTitleChanged,
    onSubmit,
    usernameInputRef,
    roomTitleInputRef,
    disableSubmit = false,
}: Props) {
    const isMobile = useIsMobile();

    const { isEnabled: shouldDisplayFormInputs, timeRemaining } = useTimedFeatureToggle(
        VFB_STREAM_TIMINGS.AllowToJoin,
    );
    console.log(timeRemaining);

    const isValid = !isFalsyOrWhitespace(roomTitle) && !isFalsyOrWhitespace(username);

    const setUsername = (newValue: string) => onUsernameChanged(newValue);

    const [isInvalidCodeError, setInvalidCodeError] = useState(
        () => new URLSearchParams(location.search).get("unknown-code") !== null,
    );

    return (
        <form action="">
            <fieldset className={classNames(styles.JoinInfoForm, { [styles.Mobile]: isMobile })}>
                <div>
                    <div className={styles.BannerStripe}>
                        {/* <a href="./"> */}
                        <img
                            src={require("../../assets/Logo_GAMERSACADEMY_white.png")}
                            alt="GA Banner"
                            className={styles.Banner}
                            width="80%"
                        />
                        {/* </a> */}
                    </div>
                    <header className="header_title">Coaching Room</header>
                    <div className={styles.JoinInfoFormControls}>
                        
                        {/* <div
                            style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                                textAlign: "center",
                            }}
                        >
                            <a onClick={onHowItWorksClicked} className={styles.HowItWorksLink}>
                                Wie funktioniert das?
                            </a>
                        </div> */}
                        {shouldDisplayFormInputs && (
                            <>
                                <input
                                    ref={usernameInputRef}
                                    type="text"
                                    placeholder="1. NAME EINGEBEN"
                                    value={username}
                                    onChange={(ev) => setUsername(ev.target.value)}
                                />
                                <input
                                    ref={roomTitleInputRef}
                                    type="text"
                                    placeholder="2. CODE EINGEBEN"
                                    value={roomTitle}
                                    className={isInvalidCodeError ? styles.InputError : ""}
                                    onChange={(ev) => {
                                        onRoomTitleChanged(ev.target.value);
                                        setInvalidCodeError(false);
                                    }}
                                />
                                <button
                                    className="btn btn--secondary"
                                    disabled={!isValid || disableSubmit}
                                    onClick={onSubmit}
                                >
                                    START
                                </button>
                                {isInvalidCodeError && (
                                    <span className={styles.ErrorMessage}>
                                        Entschuldigung, diesen Code kennen wir nicht.
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
            </fieldset>
        </form>
    );
}
