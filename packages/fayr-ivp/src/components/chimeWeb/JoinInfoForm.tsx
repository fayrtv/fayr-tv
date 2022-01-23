import classNames from "classnames";
import React, { MouseEventHandler } from "react";
import { useMediaQuery } from "react-responsive";

import usePersistedState from "hooks/usePersistedState";

import { isFalsyOrWhitespace } from "@fayr/shared-components";

import styles from "./JoinInfoForm.module.scss";

import { formatJoinRoomUrl } from "./Intro/urls";
import QRCodeView from "./QRCodeView";

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
    onRoomTitleChanged,
    onSubmit,
    usernameInputRef,
    roomTitleInputRef,
    disableSubmit = false,
}: Props) {
    const isValid = !isFalsyOrWhitespace(roomTitle) && !isFalsyOrWhitespace(username);
    const isMobile = useMediaQuery({ maxWidth: 960 });

    const [usernameInternal, setUsernameInternal] = usePersistedState("USERNAME", () => username);

    const setUsername = (newValue: string) => {
        setUsernameInternal(newValue);
        onUsernameChanged(newValue);
    };

    const qrSize = isMobile ? 100 : 150;

    return (
        <form action="">
            <fieldset
                className={classNames("mg-b-2", styles.JoinInfoForm, { [styles.Mobile]: isMobile })}
            >
                <div>
                    <input
                        className="mg-b-2"
                        ref={usernameInputRef}
                        type="text"
                        placeholder="Dein Name"
                        value={usernameInternal}
                        onChange={(ev) => setUsername(ev.target.value)}
                    />
                    <input
                        ref={roomTitleInputRef}
                        type="text"
                        placeholder="Code / Titel"
                        value={roomTitle}
                        onChange={(ev) => onRoomTitleChanged(ev.target.value)}
                    />
                    <button
                        className="mg-t-2 btn btn--primary"
                        disabled={!isValid || disableSubmit}
                        onClick={onSubmit}
                    >
                        Watch Party
                    </button>
                </div>
                {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
                {roomTitle && (
                    <QRCodeView
                        content={formatJoinRoomUrl(roomTitle)}
                        width={qrSize}
                        height={qrSize}
                        padding={1}
                    />
                )}
            </fieldset>
        </form>
    );
}
