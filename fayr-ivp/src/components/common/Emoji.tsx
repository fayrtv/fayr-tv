import React from "react";
import { default as LibraryEmoji } from "react-emoji-render";
import Styles from "./Emoji.module.scss";

export default function Emoji(props: React.ComponentProps<typeof LibraryEmoji>) {
    return <LibraryEmoji {...props} onlyEmojiClassName={Styles.revertStyles} />;
}
