import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RoomMemberRole } from "types/Room";
import isDevMode from "util/isDevMode";

import ThemeChooser from "components/ThemeChooser";
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

class Welcome extends Component<Props, State> {
    baseHref = config.BASE_HREF;
    usernameInputRef: React.RefObject<HTMLInputElement>;

    state: State = {
        role: "host",
        username: "",
        roomTitle: config.RANDOM,
        playbackURL: config.DEFAULT_VIDEO_STREAM,
        errorMsg: "",
        showError: false,
    };

    constructor(props: Props) {
        super(props);
        this.usernameInputRef = React.createRef();
    }

    componentDidMount() {
        const qs = new URLSearchParams(this.props.location.search);
        const action = qs.get("action");
        if (action === "join") {
            const title = qs.get("room");
            this.props.history.push(`${this.baseHref}/join?room=${title}`);
        }

        if (this.usernameInputRef.current) {
            this.usernameInputRef.current.focus();
        }
    }

    handleCreateRoom = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.createRoom();
    };

    setErrorMsg = (errorMsg: string) => {
        this.setState({ errorMsg, showError: true });
    };

    closeError = () => {
        this.setState({ showError: false });
    };

    get roomUrlRelative() {
        return `${this.baseHref}/meeting?room=${this.state.roomTitle}`;
    }

    createRoom() {
        const { roomTitle, username, playbackURL } = this.state;
        const data = {
            username,
            title: roomTitle,
            playbackURL,
            role: this.state.role,
        };
        localStorage.setItem(formatMeetingSsKey(roomTitle), JSON.stringify(data));
        this.props.history.push(this.roomUrlRelative);
    }

    render() {
        const { username, roomTitle, playbackURL } = this.state;
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
                            <h2>Erlebe Live- und Sportevents wie noch nie zuvor!</h2>
                            <h3>
                                Erstelle eine Watch Party oder trete einer bei und verbringe mit
                                deinen Freunden eine geile Zeit!
                            </h3>
                            {isDevMode && (
                                <>
                                    Theme: <ThemeChooser />
                                </>
                            )}
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
                                usernameInputRef={this.usernameInputRef}
                                onUsernameChanged={(newName) =>
                                    this.setState({ username: newName })
                                }
                                roomTitle={roomTitle}
                                onRoomTitleChanged={(newTitle) =>
                                    this.setState({ roomTitle: newTitle })
                                }
                                disableSubmit={!playbackURL}
                                onSubmit={this.handleCreateRoom}
                            />
                        </div>
                    </div>
                </div>
                {this.state.showError && (
                    <Error closeError={this.closeError} errorMsg={this.state.errorMsg} />
                )}
            </>
        );
    }
}

export default withRouter(Welcome);
