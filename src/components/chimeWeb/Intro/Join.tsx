import { useState, useEffect, MouseEventHandler } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Nullable } from "types/global";
import * as config from "../../../config";
import Error from "../Error";

export const Join = ({ location, history }: RouteComponentProps) => {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [userName, setUserName] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        const qs = new URLSearchParams(location.search);
        const room = qs.get("room");
        if (room) {
            setTitle(room);
        }
    }, [location]);

    const joinRoom = () => {
        const data = {
            username: userName,
            title,
            role: "Attendee",
        };

        sessionStorage.setItem(`chime[${title}]`, JSON.stringify(data));
        history.push(`${config.BASE_HREF}/meeting?room=${title}`);
    };

    const handleJoinRoom: MouseEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        joinRoom();
    };

    const closeError = () => setShowError(false);

    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        let node: Nullable<Element> = e.target as Element;
        let isModal = false;
        while (node) {
            if (node && node.classList && node.classList.contains("notice--error")) {
                isModal = true;
                break;
            }
            node = node.parentNode as Element;
        }

        if (!isModal) {
            closeError();
        }
    };

    const joinRoomDisabled = !userName;

    return (
        <div className="welcome form-grid" onClick={handleClick}>
            <div className="welcome__intro">
                <div className="intro__inner formatted-text">
                    <h1>FAYR TV</h1>
                    <h3>
                        Erstelle eine WatchParty oder trete einer bei und verbringe mit deinen
                        Freunden eine geile Zeit!
                    </h3>
                </div>
            </div>

            <div className="welcome__content pd-4">
                <div className="content__inner">
                    <h2 className="mg-b-2">Du wurdest zu einer Watch Party eingeladen!</h2>
                    <form action="">
                        <fieldset className="mg-b-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <button
                                className="mg-t-1 btn btn--primary"
                                disabled={joinRoomDisabled}
                                onClick={handleJoinRoom}
                            >
                                Beitreten
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>

            {showError && <Error closeError={closeError} errorMsg={errorMessage} />}
        </div>
    );
};

export default withRouter(Join);
