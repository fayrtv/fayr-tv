// Framework
import React, { useState } from "react";
import Picker from "emoji-picker-react";
import Emoji from "react-emoji-render";

import styles from "./ChatInput.module.scss";
import useGlobalClickHandler from "hooks/useGlobalClickHandler";
import { isInRect } from "util/coordinateUtil";
import { useSocket } from "hooks/useSocket";
import { MessageTransferObject } from "../types";
import { SocketEventType } from "../../chime/types";

type Props = {
    inputRef: React.RefObject<HTMLInputElement>;
    userName: string;
};

export const ChatInput = ({ inputRef, userName }: Props) => {
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const { socket } = useSocket();

    const emojiPickerRef = React.useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (message) {
            const data: MessageTransferObject = {
                message: message.replace(/\\/g, "\\\\").replace(/"/g, '\\"'),
                username: userName,
            };

            socket?.send({
                messageType: SocketEventType.ChatMessage,
                payload: data,
            });

            setMessage("");
        }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.keyCode !== 13) {
            // keyCode 13 is carriage return
            return;
        }

        sendMessage();
    };

    const onInput: React.ChangeEventHandler<HTMLInputElement> = (event) =>
        setMessage(event.target.value);

    useGlobalClickHandler((clickEvent) => {
        if (!emojiPickerOpen && !emojiPickerRef.current) {
            return;
        }

        if (
            !isInRect(emojiPickerRef.current!.getBoundingClientRect(), clickEvent.x, clickEvent.y)
        ) {
            setEmojiPickerOpen(false);
        }
    });

    React.useEffect(() => {
        if (inputRef.current === document.activeElement) {
            inputRef.current!.selectionStart = 500000;
            inputRef.current!.selectionEnd = 500000;
        }
    }, [message, inputRef]);

    return (
        <div className={`composer chime-web-composer full-width ${styles.ChatInput}`}>
            <div className={styles.InputSection}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Hier tippen ..."
                    value={message}
                    maxLength={510}
                    onChange={onInput}
                    onKeyDown={onKeyDown}
                />
                <div
                    className={styles.EmojiIconContainer}
                    onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                >
                    <div className={styles.EmojiIcon}>
                        <Emoji text=":)" />
                    </div>
                </div>
                {emojiPickerOpen && (
                    <div
                        ref={emojiPickerRef}
                        className={styles.EmojiPicker}
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        <Picker
                            onEmojiClick={(_, data) => {
                                setMessage(`${message}${data.emoji}`);
                                inputRef.current!.focus();
                            }}
                        />
                    </div>
                )}
            </div>
            <button disabled={!socket} className="btn btn--primary" onClick={sendMessage}>
                Senden
            </button>
        </div>
    );
};

export default ChatInput;
