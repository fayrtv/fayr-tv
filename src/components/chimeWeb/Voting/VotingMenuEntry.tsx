// Framework
import * as React from "react";

// Types
import { VotingPage } from "./types";

import styles from "./styles/VotingMenuEntry.module.scss";

type Props = {
	label: string;
	page: VotingPage;
	selectedPage: VotingPage;
	setVotingPage(votingPage: VotingPage): void;
}

export const VotingMenuEntry = ({ label, page, selectedPage, setVotingPage }: Props) => {
	return (
		<div 
			className={`${styles.VotingMenuEntry} ${page === selectedPage ? styles.Selected : ""}`}
			onClick={() => setVotingPage(page)}>
			<span>
				{label}
			</span>
		</div>
	);
}

export default VotingMenuEntry;