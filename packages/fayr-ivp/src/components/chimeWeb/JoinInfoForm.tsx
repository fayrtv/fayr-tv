import classNames from "classnames";
import React, { MouseEventHandler } from "react";

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

    const isValid = !isFalsyOrWhitespace(roomTitle) && !isFalsyOrWhitespace(username);

    const setUsername = (newValue: string) => onUsernameChanged(newValue);

    return (
        <form action="">
            <fieldset className={classNames(styles.JoinInfoForm, { [styles.Mobile]: isMobile })}>
                <div>
                    <div className={styles.BannerStripe}>
                        {/* <a href="./"> */}
                            <img
                                src={require("../../assets/vfb-logo.png")}
                                alt="VfB Banner"
                                className={styles.Banner}
                            />
                        {/* </a> */}
                    </div>
                    <div className={styles.JoinInfoFormControls}>
                        Am <b>16.11. ab 17:25</b> kannst du hier mit deinen Freunden auf der
                        virtuellen Couch das Testspiel gegen den <b>Brentford FC</b> verfolgen!
                        <div
                            style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                                textAlign: "center",
                            }}
                        >
                            <a onClick={onHowItWorksClicked} className={styles.HowItWorksLink}>
                                Wie funktioniert das?
                            </a>
                        </div>
                        {/*<input*/}
                        {/*    ref={usernameInputRef}*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Dein Name"*/}
                        {/*    value={username}*/}
                        {/*    onChange={(ev) => setUsername(ev.target.value)}*/}
                        {/*/>*/}
                        {/*<input*/}
                        {/*    ref={roomTitleInputRef}*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Code"*/}
                        {/*    value={roomTitle}*/}
                        {/*    onChange={(ev) => onRoomTitleChanged(ev.target.value)}*/}
                        {/*/>*/}
                        {/*<button*/}
                        {/*    className="btn btn--secondary"*/}
                        {/*    disabled={!isValid || disableSubmit}*/}
                        {/*    onClick={onSubmit}*/}
                        {/*>*/}
                        {/*    STARTEN*/}
                        {/*</button>*/}
                    </div>
                </div>
                {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
            </fieldset>
        </form>
    );
}
