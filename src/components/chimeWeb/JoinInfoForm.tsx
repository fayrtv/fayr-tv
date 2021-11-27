import QRCodeView from "./QRCodeView";
import { formatJoinRoomUrl } from "./Intro/urls";
import React, { SetStateAction } from "react";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";
import { isFalsyOrWhitespace } from "util/stringUtils";

import styles from "./JoinInfoForm.module.scss";

type Props = {
    username: string;
    onUsernameChanged: React.Dispatch<SetStateAction<string>>;
    roomCode: string;
    onRoomCodeChanged: React.Dispatch<SetStateAction<string>>;
    onSubmit: () => void;
    disableSubmit?: boolean;
    usernameInputRef?: React.Ref<HTMLInputElement>;
    roomTitleInputRef?: React.Ref<HTMLInputElement>;
};

export function JoinInfoForm({
    username,
    onUsernameChanged,
    roomCode,
    onRoomCodeChanged,
    onSubmit,
    usernameInputRef,
    roomTitleInputRef,
    disableSubmit = false,
}: Props) {
    const isValid = !isFalsyOrWhitespace(roomCode) && !isFalsyOrWhitespace(username);
    const isMobile = useMediaQuery({ maxWidth: 960 });

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
                        value={username}
                        onChange={(ev) => onUsernameChanged(ev.target.value)}
                    />
                    <input
                        ref={roomTitleInputRef}
                        type="text"
                        placeholder="Code / Titel"
                        value={roomCode}
                        onChange={(ev) => onRoomCodeChanged(ev.target.value)}
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
                {roomCode && (
                    <QRCodeView
                        content={formatJoinRoomUrl(roomCode)}
                        width={qrSize}
                        height={qrSize}
                        padding={1}
                    />
                )}
            </fieldset>
        </form>
    );
}
