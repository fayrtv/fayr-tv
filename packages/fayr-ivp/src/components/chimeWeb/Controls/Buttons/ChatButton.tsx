// Framework
import classNames from "classnames";
import * as React from "react";
import { useSelector } from "react-redux";
import { ReduxStore } from "redux/store";
import { withoutPropagation } from "util/mouseUtils";

import { Message } from "components/chat/types";

// Styles
import styles from "./ChatButton.module.scss";

// Functionality
import { ChatOpenContext } from "../../../contexts/ChatOpenContext";

export const ChatButton = () => {
    const { isOpen: isChatOpen, set: setChatOpen } = React.useContext(ChatOpenContext);

    const handleChatClick = () => {
        setChatOpen(!isChatOpen);
    };

    const unreadMessages = useSelector<ReduxStore, Array<Message>>(
        (x) => x.chatMessageReducer.filter((x) => !x.seen) ?? [],
    );

    const chat_controls = isChatOpen ? `${styles.Active}` : "";

    return (
        <div
            key="ChatButton"
            className={classNames(
                styles.Button,
                chat_controls,
                styles.ChatContainer,
                "btn rounded",
            )}
            title={`Chat ${isChatOpen ? "ausblenden" : "anzeigen"}`}
            onClick={withoutPropagation(handleChatClick)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M 13 3 C 6.925 3 2 7.477 2 13 C 2 15.836604 3.3081273 18.387771 5.3964844 20.205078 C 5.0969391 21.186048 4.4721018 22.161699 3.3242188 23.03125 A 0.5 0.5 0 0 1 3.3222656 23.033203 A 0.5 0.5 0 0 0 3 23.5 A 0.5 0.5 0 0 0 3.5 24 A 0.5 0.5 0 0 0 3.6015625 23.988281 C 5.5416307 23.982628 7.1969423 23.153925 8.5136719 22.115234 C 9.1385204 22.369393 9.7907693 22.578929 10.470703 22.724609 C 10.166703 21.864609 10 20.949 10 20 C 10 15.037 14.486 11 20 11 C 21.382 11 22.699437 11.253891 23.898438 11.712891 C 23.202437 6.7988906 18.594 3 13 3 z M 20 13 A 8 7 0 0 0 12 20 A 8 7 0 0 0 20 27 A 8 7 0 0 0 22.984375 26.490234 C 24.210733 27.346924 25.694866 27.982344 27.394531 27.988281 A 0.5 0.5 0 0 0 27.5 28 A 0.5 0.5 0 0 0 28 27.5 A 0.5 0.5 0 0 0 27.671875 27.03125 C 26.756686 26.336428 26.170113 25.571619 25.818359 24.792969 A 8 7 0 0 0 28 20 A 8 7 0 0 0 20 13 z"
                    fill={isChatOpen ? "#07090C" : "#D2D2D2"}
                />
            </svg>
            {!isChatOpen && unreadMessages.length > 0 && (
                <span className={`${styles.Button} ${styles.UnreadTag}`}>
                    {unreadMessages.length > 99 ? "99+" : unreadMessages.length}
                </span>
            )}
        </div>
    );
};

export default ChatButton;
