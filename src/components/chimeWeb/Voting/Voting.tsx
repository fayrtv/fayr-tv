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
import MaterialIcon from "components/common/MaterialIcon";
import { Nullable } from "types/global";

type Props = {
	votingRef: React.RefObject<HTMLDivElement>;
	votingData: VotingData;

	setVoting: React.Dispatch<Nullable<VotingData>>;
}

export const Voting = ({ votingRef, setVoting, votingData: { hostTeam, guestTeam} }: Props) => {

	const [hostTip, setHostTip] = React.useState(0);
	const [guestTip, setGuestTip] = React.useState(0);

	const onTip = () => {
		console.log(`Tip: ${hostTeam.identifier}:${hostTip} vs  ${guestTeam.identifier}:${guestTip}`)
	}

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
						'HostTeamIcon TeamCounter' 
						'GuestTeamIcon TeamCounter'
						'ButtonSection ButtonSection'
					`,
					gap: "1rem",
					gridTemplateColumns: "minmax(100px, 1fr) 2fr",
					gridTemplateRows: "minmax(100px, 1fr) minmax(100px, 1fr)"
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
						gridArea: "TeamCounter"
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
				<Cell
					cellStyles={{
						gridArea: "ButtonSection"
					}}>
					<Flex
						direction="Row"
						mainAlign="Center"
						crossAlign="Center">
						<div
							onClick={onTip}
							className={styles.TipButton}>
							<span>
								TIP SETZEN
							</span>
						</div>
						<div
							className={styles.CloseButton}
							onClick={() => setVoting(null)}>
							<MaterialIcon
								size={30}
								color="white"
								iconName="close"/>
						</div>
					</Flex>
				</Cell>
			</Grid>
		</Flex>
	);
}

export default Voting;