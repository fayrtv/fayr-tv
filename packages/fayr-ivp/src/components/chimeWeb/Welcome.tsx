import React, { useState } from "react";
import { RouteComponentProps, useRouteMatch, withRouter } from "react-router-dom";

import { usePersistedState } from "@fayr/common";
import { Flex } from "@fayr/common";

import * as config from "../../config";
import Error from "./Error";
import { JoinInfoForm } from "./JoinInfoForm";
import { formatMeetingSsKey } from "./Meeting/storage";
import ConditionalSafariSupportWarning from "./SafariSupportWarning";
import Tutorial from "./Tutorial/Tutorial";

type Props = RouteComponentProps;

const Welcome = (props: Props) => {
    let { url } = useRouteMatch<{ platform?: string }>();

    if (url === "/") {
        url = "";
    }

    const [username, setUsername] = usePersistedState<string>("USERNAME", () => "");
    const [roomTitle, setRoomTitle] = React.useState("");
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

    const roomUrlRelative = React.useMemo(
        () => `${url}/meeting?room=${roomTitle}`,
        [roomTitle, url],
    );

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

    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <>
            <div className="welcome form-grid">
                <div className="welcome__intro">
                    <div className="intro__inner formatted-text">
                        <h1>Willkommen in der VfB-Watch-Party</h1>
                    </div>
                </div>

                <ConditionalSafariSupportWarning />
                <Tutorial show={showTutorial} setShow={setShowTutorial} />

                <div className="welcome__content pd-4">
                    <div className="content__inner">
                        <JoinInfoForm
                            onHowItWorksClicked={() => setShowTutorial(true)}
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
                <Flex className="imprint__links" direction="Row">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.vfb.de/de/1893/club/service/formales/impressum/"
                    >
                        Impressum
                    </a>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.vfb.de/de/1893/club/service/formales/datenschutz/"
                    >
                        Datenschutz
                    </a>
                </Flex>
            </div>
            {showError && <Error closeError={() => setShowError(false)} errorMsg={errorMessage} />}
        </>
    );
};

export default withRouter(Welcome);
