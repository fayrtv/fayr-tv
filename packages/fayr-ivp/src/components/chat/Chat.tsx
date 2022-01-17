import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
// Functionality
import { addMessage, markAsSeen } from "redux/reducers/chatMessageReducer";

import { useSocket } from "hooks/useSocket";

// Styles
import "./Chat.scss";

import { ReduxStore } from "../../redux/store";
import { CouldBeArray } from "../../util/collectionUtil";
import { IChimeSocket } from "../chime/ChimeSdkWrapper";
import { SocketEventType } from "../chime/types";
import { ChatOpenContext } from "../contexts/ChatOpenContext";
import ChatInput from "./subcomponents/ChatInput";
import ChatLine from "./subcomponents/ChatLine";
// Types
import { Message, MessageTransferObject } from "./types";

type Props = {
    chimeSocket: IChimeSocket;
    userName: string;
    title: string;
};

type ReduxProps = {
    messages: Array<Message>;
};

type ReduxDispatches = {
    addMessages(messages: CouldBeArray<Message>): void;
    markAsSeen(messages: CouldBeArray<Message>): void;
};

export const Chat: React.FC<Props & ReduxProps & ReduxDispatches> = ({
    chimeSocket,
    userName,
    title,
    messages,
    addMessages,
    markAsSeen,
}) => {
    const chatRef = React.useRef<HTMLInputElement>(null);
    const messageRef = React.useRef<HTMLDivElement>(null);

    const { isOpen } = React.useContext(ChatOpenContext);

    const { socket, setSocket } = useSocket();

    React.useEffect(() => {
        chimeSocket.joinRoomSocket().then((createdSocket) => {
            setSocket(createdSocket);
        });
    }, [chimeSocket, setSocket]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        socket.addListener<MessageTransferObject>(SocketEventType.ChatMessage, (event) => {
            const { username, message } = event;

            const newMessage: Message = {
                timestamp: Date.now(),
                username,
                message,
                seen: false,
            };

            addMessages(newMessage);

            return Promise.resolve();
        });

        return () => socket.close(5000);
    }, [socket, addMessages]);

    React.useLayoutEffect(() => {
        chatRef.current?.focus();
    }, [chatRef]);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const ref = messageRef.current;

        if (ref && ref.scrollTop + ref.clientHeight < ref.scrollHeight) {
            messageRef.current!.scrollTo({ top: ref.scrollHeight, behavior: "smooth" });
        }
    }, [isOpen, messages]);

    React.useEffect(() => {
        if (isOpen) {
            const unseenMessages = messages.filter((x) => !x.seen);
            if (unseenMessages.length > 0) {
                markAsSeen(unseenMessages);
            }
        }
    }, [messages, isOpen, markAsSeen]);

    return (
        <div
            className={`Chat ${!isOpen ? "Closed" : ""} ${
                messages.length === 0 ? "NoMessages" : ""
            }`}
        >
            <div className="ChatWrapper pos-relative">
                <div className="Messages pd-x-1" ref={messageRef}>
                    {messages.map((x) => (
                        <ChatLine messageInfo={x} key={x.timestamp} personalUserName={userName} />
                    ))}
                </div>
            </div>
            <ChatInput inputRef={chatRef} userName={userName} />
        </div>
    );
};

const mapStateToProps = (state: ReduxStore): ReduxProps => ({
    messages: state.chatMessageReducer,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ReduxDispatches => ({
    addMessages: (messages: CouldBeArray<Message>) => dispatch(addMessage(messages)),
    markAsSeen: (messages: CouldBeArray<Message>) => dispatch(markAsSeen(messages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
