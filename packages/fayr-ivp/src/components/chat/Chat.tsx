import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { addMessage, markAsSeen } from "redux/reducers/chatMessageReducer";
import { ReduxStore } from "redux/store";
import { CouldBeArray } from "util/collectionUtil";

import { useSocket } from "hooks/useSocket";

import "./Chat.scss";

import { IChimeSocket } from "../chime/ChimeSdkWrapper";
import { SocketEventType } from "../chime/types";
import { ChatOpenContext } from "../contexts/ChatOpenContext";
import ChatInput from "./subcomponents/ChatInput";
import ChatLine from "./subcomponents/ChatLine";
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
    userName,
    messages,
    addMessages,
    markAsSeen,
}) => {
    const chatRef = React.useRef<HTMLInputElement>(null);
    const messageRef = React.useRef<HTMLDivElement>(null);

    const { isOpen } = React.useContext(ChatOpenContext);

    const { socket } = useSocket();

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        socket.addListener<MessageTransferObject>(SocketEventType.ChatMessage, (event) => {
            addMessages(createMessageFromTransferObject(event));
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

    const sendMessage = (data: MessageTransferObject) => {
        const message = createMessageFromTransferObject(data);
        addMessages(message);
        socket?.send({
            messageType: SocketEventType.ChatMessage,
            payload: data,
        });
    };

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
            <ChatInput inputRef={chatRef} userName={userName} sendMessage={sendMessage} />
        </div>
    );
};

const createMessageFromTransferObject = ({ id, username, message }: MessageTransferObject) => ({
    id,
    timestamp: Date.now(),
    username,
    message,
    seen: false,
});

const mapStateToProps = (state: ReduxStore): ReduxProps => ({
    messages: state.chatMessageReducer,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ReduxDispatches => ({
    addMessages: (messages: CouldBeArray<Message>) => dispatch(addMessage(messages)),
    markAsSeen: (messages: CouldBeArray<Message>) => dispatch(markAsSeen(messages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
