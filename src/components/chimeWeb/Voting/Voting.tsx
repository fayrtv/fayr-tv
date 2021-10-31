// Framework
import * as React from "react";

// Components
import Grid from "components/common/GridLayout/Grid";

// Types
import { VotingData } from "./types";

// Styles
import styles from "./styles/Voting.module.scss";
import Cell from "components/common/GridLayout/Cell";
import Flex from 'components/common/Flex';
import VoteCounter from './VoteCounter';

type Props = {
	votingRef: React.RefObject<HTMLDivElement>;
	votingData: VotingData;
}

export const Voting = ({ votingRef, votingData: { hostTeam, guestTeam} }: Props) => {

	const [hostTip, setHostTip] = React.useState(0);
	const [guestTip, setGuestTip] = React.useState(0);

	return (
		<Flex
			direction="Column"
			crossAlign="Center"
			className={styles.VotingWrapper}
			ref={votingRef}>
			<Grid 
				className={styles.Voting}
				gridProperties={{
					gridTemplateAreas: `
						'HostTeamIcon Counter' 
						'GuestTeamIcon Counter'
					`,
					gridTemplateColumns: "250px 1fr",
					gridTemplateRows: "250px 250px",
				}}>
				<Cell
					className={styles.TeamIcon}
					cellStyles={{
						gridArea: "HostTeamIcon"
					}}>
					<img
						alt="Heimmannschaft"
						src={hostTeam.teamIconSource}>
					</img>
				</Cell>
				<Cell
					className={styles.TeamIcon}
					cellStyles={{
						gridArea: "GuestTeamIcon"
					}}>
					<img
						alt="Gastmannschaft"
						src={guestTeam.teamIconSource}>
					</img>
				</Cell>
				<Cell
					className={styles.VotingSectionContainer}
					cellStyles={{
						gridArea: "Counter"
					}}>
					<Flex 
						className={styles.VotingSection}
						space="Between"
						direction="Column">
						<VoteCounter 
							value={hostTip}
							setValue={setHostTip}/>
						<VoteCounter 
							value={guestTip}
							setValue={setGuestTip}/>
					</Flex>
				</Cell>
			</Grid>
			<div
				onClick={event => {
					event.preventDefault();
					event.stopPropagation();
					console.log(`Tip: ${hostTeam.identifier}:${hostTip} vs  ${guestTeam.identifier}:${guestTip}`)
				}}
				className={styles.TipButton}>
				<span>
					TIP SETZEN
				</span>
			</div>
		</Flex>
	);
}

export default Voting;