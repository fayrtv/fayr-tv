// Framework
import * as React from "react";

import styles from "./styles/VotingMenuEntry.module.scss";

// Types
import { VotingPage } from "./types";

type Props = {
    content: React.ReactNode;
    page: VotingPage;
    selectedPage: VotingPage;
    setVotingPage(votingPage: VotingPage): void;
};

export const VotingMenuEntry = ({ content, page, selectedPage, setVotingPage }: Props) => {
    return (
        <div
            className={`${styles.VotingMenuEntry} ${page === selectedPage ? styles.Selected : ""}`}
            onClick={() => setVotingPage(page)}
        >
            {content}
        </div>
    );
};

export default VotingMenuEntry;
