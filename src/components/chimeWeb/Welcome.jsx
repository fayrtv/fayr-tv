import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as config from "../../config";
import Error from "./Error";
import { formatMeetingSsKey } from "./Meeting/storage";
import * as PropTypes from "prop-types";
import { JoinInfoForm } from "./JoinInfoForm";

JoinInfoForm.propTypes = {
    value: PropTypes.string,
    ref: PropTypes.any,
    onChange: PropTypes.func,
    value1: PropTypes.string,
    onChange1: PropTypes.func,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

class Welcome extends Component {
    state = {
        role: "host",
        username: "",
        roomTitle: config.RANDOM,
        playbackURL: config.DEFAULT_VIDEO_STREAM,
        message: "",
        showError: false,
    };

    constructor() {
        super();
        this.baseHref = config.BASE_HREF;
        this.usernameInputRef = React.createRef();
    }

    componentDidMount() {
        const qs = new URLSearchParams(this.props.location.search);
        const action = qs.get("action");
        if (action === "join") {
            const title = qs.get("room");
            this.props.history.push(`${this.baseHref}/join?room=${title}`);
        }
        this.usernameInputRef.current.focus();
    }

    handlePlaybackURLChange = (e) => {
        this.setState({ playbackURL: e.target.value });
    };

    handleCreateRoom = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.createRoom();
    };

    setErrorMsg = (errorMsg) => {
        this.setState({ errorMsg, showError: true });
    };

    closeError = () => {
        this.setState({ showError: false });
    };

    get roomUrlRelative() {
        return `${this.baseHref}/meeting?room=${this.state.roomTitle}`;
    }

    async createRoom() {
        const { roomTitle, username, playbackURL } = this.state;
        const data = {
            username,
            title: roomTitle,
            playbackURL,
            role: this.state.role,
        };
        sessionStorage.setItem(formatMeetingSsKey(roomTitle), JSON.stringify(data));
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
                                src="https://i.ibb.co/jGzKGYw/fayrtv-logo.png"
                                alt="fayrtv-logo"
                                border="0"
                                height="200"
                            />
                            <h2>Erlebe Live- und Sportevents wie noch nie zuvor!</h2>
                            <h3>
                                Erstelle eine Watch Party oder trete einer bei und verbringe mit
                                deinen Freunden eine geile Zeit!
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
                                usernameInputRef={this.usernameInputRef}
                                onUsernameChanged={(newName) =>
                                    this.setState({ username: newName })
                                }
                                roomTitle={roomTitle}
                                onRoomTitleChanged={(newCode) =>
                                    this.setState({ roomTitle: newCode })
                                }
                                disableSubmit={!playbackURL}
                                onSubmit={this.handleCreateRoom}
                            />
                        </div>
                    </div>
                </div>
                {this.state.showError && (
                    <Error closeError={this.closeError} errorMsg={this.state.message} />
                )}
            </>
        );
    }
}

export default withRouter(Welcome);
