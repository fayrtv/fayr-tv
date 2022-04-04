import React from "react";
import { RouteComponentProps, useRouteMatch, withRouter } from "react-router-dom";
import { RoomMemberRole } from "types/Room";

import { usePlatformConfig } from "hooks/usePlatformConfig";

import { IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";

import * as config from "../../config";
import Error from "./Error";
import { JoinInfoForm } from "./JoinInfoForm";
import { formatMeetingSsKey } from "./Meeting/storage";

type Props = RouteComponentProps & {
    chime: IChimeSdkWrapper;
};

type State = {
    role: RoomMemberRole;
    username: string;
    roomTitle: string;
    playbackURL: string;
    errorMsg?: string;
    showError: boolean;
};

const Welcome = (props: Props) => {
    const { url } = useRouteMatch<{ platform?: string }>();

    const { platformConfig } = usePlatformConfig();

    const [state, setState] = React.useState<State>({
        role: "host",
        username: "",
        roomTitle: config.RANDOM,
        playbackURL: config.DEFAULT_VIDEO_STREAM,
        errorMsg: "",
        showError: false,
    });

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

    const closeError = () => {
        setState((curr) => ({ ...curr, showError: false }));
    };

    const roomUrlRelative = React.useMemo(() => {
        return `${url}/meeting?room=${state.roomTitle}`;
    }, [state.roomTitle, url]);

    const createRoom = () => {
        const { roomTitle, username, playbackURL } = state;
        const data = {
            username,
            title: roomTitle,
            playbackURL,
            role: state.role,
        };
        localStorage.setItem(formatMeetingSsKey(roomTitle), JSON.stringify(data));
        props.history.push(roomUrlRelative);
    };

    const { username, roomTitle, playbackURL } = state;

    const welcomeMessage =
        platformConfig?.info?.welcomeMessage ?? "Erlebe Live- und Sportevents wie noch nie zuvor!";

    return (
        <>
            <div className="welcome form-grid">
                <div className="welcome__intro">
                    <div className="intro__inner formatted-text">
                        <img
                            src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
                            alt="fayrtv-logo"
                            height="70"
                            style={{ border: "none" }}
                        />
                        <br />
                        <h2>{welcomeMessage}</h2>
                        <h3>
                            Erstelle eine Watch Party oder trete einer bei und verbringe mit deinen
                            Freunden eine geile Zeit!
                        </h3>
                    </div>
                </div>

                <div className="welcome__content pd-4">
                    <div className="content__inner">
                        <h2 className="mg-b-2">Starte eine Watch Party</h2>
                        <h3>
                            Fiebere zusammen mit deinen Freunden mit und schaue dir Live- und
                            Sportevents online an!
                        </h3>
                        <JoinInfoForm
                            username={username}
                            usernameInputRef={usernameInputRef}
                            onUsernameChanged={(newName) =>
                                setState((curr) => ({ ...curr, username: newName }))
                            }
                            roomTitle={roomTitle}
                            onRoomTitleChanged={(newTitle) =>
                                setState((curr) => ({ ...curr, roomTitle: newTitle }))
                            }
                            disableSubmit={!playbackURL}
                            onSubmit={handleCreateRoom}
                        />
                    </div>
                </div>
            </div>
            {state.showError && <Error closeError={closeError} errorMsg={state.errorMsg} />}
        </>
    );
};

export default withRouter(Welcome);
