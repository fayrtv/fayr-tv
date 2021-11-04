// Framework
import * as React from "react";

// Components 
import Grid from "components/common/GridLayout/Grid";
import Cell from "components/common/GridLayout/Cell";

//Types
import { VotingData } from "../types";

// Styles
import styles from "./OverviewPage.module.scss";
import Flex from "components/common/Flex";

type Props = {
	voting: VotingData;
}

export const OverviewPage = ({ voting: { guestTeam, hostTeam, votes } }: Props) => {

	const sortedVotes = React.useMemo(() => votes.sort((left, right) => left.attendeeId.localeCompare(right.attendeeId)), [votes]);

	return (
		<div className={styles.OverviewPageContainer}>
			<Grid 
				className={styles.OverviewPage}
				gridProperties={{
					gridTemplateAreas: `
						'Rank HostTeamIcon GuestTeamIcon' 
						'RankGrid RankGrid RankGrid'
					`,
					gap: "2rem",
					gridTemplateColumns: "1fr 60px 60px",
					gridTemplateRows: "60px 1fr",
				}}>
				<Cell gridArea="Rank">
					<div className={styles.RankSection}>
						<span>
							Rang
						</span>
					</div>
				</Cell>
				<Cell 
					className={styles.TeamIcon}
					gridArea="HostTeamIcon">
					<img
						alt={hostTeam.identifier}
						src={hostTeam.teamIconSource}>
					</img>
				</Cell>
				<Cell
					className={`${styles.TeamIcon} ${styles.GuestTeamIcon}`}
					gridArea="GuestTeamIcon">
					<img
						alt={guestTeam.identifier}
						src={guestTeam.teamIconSource}>
					</img>
				</Cell>
				<Cell gridArea="RankGrid">
					<Flex
						className={styles.RankGrid}
						direction="Column">
						{
							sortedVotes.map((vote, index) => (
								<Flex 
									direction="Row"
									crossAlign="Center"
									key={vote.attendeeId}>
									<span className={styles.Rank}>
										{index + 1}
									</span>
									<span className={styles.Attendee}>
										{vote.attendeeId}
									</span>
									<span className={styles.Host}>
										{vote.hostTeam}
									</span>
									<span className={styles.Guest}>
										{vote.guestTeam}
									</span>
								</Flex>
							))
						}
						{
							[...Array(12 - votes.length)].map((_, index) => <div key={index} />)
						}
					</Flex>					
				</Cell>			
			</Grid>
		</div>
	);
}

export default OverviewPage;