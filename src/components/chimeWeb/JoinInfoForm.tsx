import QRCodeView from "./QRCodeView";
import { formatJoinRoomUrl } from "./Intro/urls";
import React, { SetStateAction } from "react";
import { isFalsyOrWhitespace } from "util/stringUtils";

type Props = {
    username: string;
    onUsernameChanged: React.Dispatch<SetStateAction<string>>;
    roomCode: string;
    onRoomCodeChanged: React.Dispatch<SetStateAction<string>>;
    onSubmit: () => void;
    disableSubmit?: boolean;
    usernameInputRef?: React.Ref<HTMLInputElement>;
    roomCodeInputRef?: React.Ref<HTMLInputElement>;
};

export function JoinInfoForm({
    username,
    onUsernameChanged,
    roomCode,
    onRoomCodeChanged,
    onSubmit,
    usernameInputRef,
    roomCodeInputRef,
    disableSubmit = false
}: Props) {
    const isValid = !isFalsyOrWhitespace(roomCode) && !isFalsyOrWhitespace(username);
    return (
        <form action="">
            <fieldset className="mg-b-2">
                <input
                    className="mg-b-2"
                    ref={usernameInputRef}
                    type="text"
                    placeholder="Dein Name"
                    value={username}
                    onChange={(ev) => onUsernameChanged(ev.target.value)}
                />
                <input
                    ref={roomCodeInputRef}
                    type="text"
                    placeholder="Code"
                    value={roomCode}
                    onChange={(ev) => onRoomCodeChanged(ev.target.value)}
                />
                {/* <input type="text" placeholder="Playback URL" value={playbackURL} onChange={this.handlePlaybackURLChange} /> */}
                {roomCode && (
                    <QRCodeView
                        content={formatJoinRoomUrl(roomCode)}
                        width={150}
                        height={150}
                        padding={1}
                    />
                )}
                <button className="mg-t-2 btn btn--primary" disabled={!isValid || disableSubmit} onClick={onSubmit}>
                    Watch Party
                </button>
            </fieldset>
        </form>
    );
}
