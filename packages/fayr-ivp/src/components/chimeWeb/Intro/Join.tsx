import classNames from "classnames";
import React, { useState, useEffect, MouseEventHandler } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Nullable } from "types/global";

import Error from "components/chimeWeb/Error";
import ImprintFooter from "components/chimeWeb/ImprintFooter";
import styles from "components/chimeWeb/JoinInfoForm.module.scss";

import { Flex } from "@fayr/common";

import joinStyles from "./Join.module.scss";

import * as config from "../../../config";
import Tutorial from "../Tutorial/Tutorial";

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
            userName,
            title,
            role: "Attendee",
        };

        localStorage.setItem(`chime[${title.toLowerCase()}]`, JSON.stringify(data));
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

    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <div className="welcome form-grid" onClick={handleClick}>
            <div className="welcome__intro">
                <div className="intro__inner formatted-text">
                    <h1>Du wurdest zu einer Watch-Party eingeladen</h1>
                </div>
            </div>

            <Tutorial show={showTutorial} setShow={setShowTutorial} />

            <div className="welcome__content pd-4">
                <div className={classNames("content__inner", joinStyles.ContentInner)}>
                    <div className={styles.BannerStripe}>
                        {/* <a href="../"> */}
                        <img
                            src={require("../../../assets/vfb-logo.png")}
                            alt="VfB Banner"
                            className={styles.Banner}
                        />
                        {/* </a> */}
                    </div>
                    <a onClick={() => setShowTutorial(true)} className={joinStyles.HowItWorksLink}>
                        Wie funktioniert das?
                    </a>
                    <div className={styles.JoinInfoFormControls}>
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
            </div>
            <ImprintFooter />

            {showError && <Error closeError={closeError} errorMsg={errorMessage} />}
        </div>
    );
};

export default withRouter(Join);
