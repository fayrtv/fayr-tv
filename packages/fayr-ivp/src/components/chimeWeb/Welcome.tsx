import React from "react";
import { RouteComponentProps, useRouteMatch, withRouter } from "react-router-dom";

import { usePlatformConfig } from "hooks/usePlatformConfig";
import useTranslations from "hooks/useTranslations";

import { FayrLogo } from "@fayr/shared-components";

import * as config from "../../config";
import Error from "./Error";
import { JoinInfoForm } from "./JoinInfoForm";
import { formatMeetingSsKey } from "./Meeting/storage";

type Props = RouteComponentProps;

const Welcome = (props: Props) => {
    let { url } = useRouteMatch<{ platform?: string }>();

    if (url === "/") {
        url = "";
    }

    const { platformConfig } = usePlatformConfig();

    const tl = useTranslations();

    const [username, setUsername] = React.useState("");
    const [roomTitle, setRoomTitle] = React.useState(config.RANDOM);
    const [playbackURL] = React.useState(config.DEFAULT_VIDEO_STREAM);
    const [errorMessage] = React.useState("");
    const [showError, setShowError] = React.useState(false);

    const usernameInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const qs = new URLSearchParams(props.location.search);
        const action = qs.get("action");
        if (action === "join") {
            const title = qs.get("room");
            props.history.push(`${url}/join?room=${title}`);
        }

        if (usernameInputRef.current) {
            usernameInputRef.current.focus();
        }
    }, [props.history, props.location.search, url]);

    const handleCreateRoom = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        createRoom();
    };

    const roomUrlRelative = React.useMemo(() => {
        return `${url}/meeting?room=${roomTitle}`;
    }, [roomTitle, url]);

    const createRoom = () => {
        const data = {
            userName: username,
            title: roomTitle,
            playbackURL,
            role: "host",
        };
        localStorage.setItem(formatMeetingSsKey(roomTitle), JSON.stringify(data));
        props.history.push(roomUrlRelative);
    };

    const welcomeMessage = platformConfig?.info?.welcomeMessage ?? tl.WelcomeMessageHeader;

    return (
        <>
            <div className="welcome form-grid">
                <div className="welcome__intro">
                    <div className="intro__inner formatted-text">
                        <FayrLogo style={{ border: "none" }} />
                        <br />
                        <h2>{welcomeMessage}</h2>
                        <h3>{tl.WelcomeMessageBody}</h3>
                    </div>
                </div>

                <div className="welcome__content pd-4">
                    <div className="content__inner">
                        <h2 className="mg-b-2">{tl.StartWatchPartyHeader}</h2>
                        <h3>{tl.StartWatchPartyBody}</h3>
                        <JoinInfoForm
                            username={username}
                            usernameInputRef={usernameInputRef}
                            onUsernameChanged={setUsername}
                            roomTitle={roomTitle}
                            onRoomTitleChanged={setRoomTitle}
                            disableSubmit={!playbackURL}
                            onSubmit={handleCreateRoom}
                        />
                    </div>
                </div>
            </div>
            {showError && <Error closeError={() => setShowError(false)} errorMsg={errorMessage} />}
        </>
    );
};

export default withRouter(Welcome);
