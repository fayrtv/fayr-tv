import classNames from "classnames";
import React, { MouseEventHandler } from "react";

import { formatJoinRoomUrl } from "components/chimeWeb/Intro/urls";
import { useIsMobile } from "components/mediaQueries";

import { isFalsyOrWhitespace } from "@fayr/common";

import { Container, QRCode } from "@fayr/ivp-components";

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
    onRoomTitleChanged,
    onSubmit,
    usernameInputRef,
    roomTitleInputRef,
    disableSubmit = false,
}: Props) {
    const isMobile = useIsMobile();

    const isValid = !isFalsyOrWhitespace(roomTitle) && !isFalsyOrWhitespace(username);

    const setUsername = (newValue: string) => onUsernameChanged(newValue);

    const qrSize = isMobile ? 100 : 150;

    return (
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
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Playback URL"*/}
            {/*    value={playbackURL}*/}
            {/*    onChange={this.handlePlaybackURLChange}*/}
            {/*/>*/}
            {/*{roomTitle && (*/}
            {/*    <QRCode*/}
            {/*        content={formatJoinRoomUrl(roomTitle)}*/}
            {/*        width={qrSize}*/}
            {/*        height={qrSize}*/}
            {/*        padding={1}*/}
            {/*    />*/}
            {/*)}*/}
        </fieldset>
    );
}

JoinInfoForm.displayName = "JoinInfoForm";
