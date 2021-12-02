// Framework
import * as React from "react";

// Components
import Flex from "components/common/Flex";
import Grid from "components/common/GridLayout/Grid";
import Cell from "components/common/GridLayout/Cell";

import VoteCounter from "../VoteCounter";

// Styles
import styles from "./VotePage.module.scss";
import { VotingData } from "../types";

type Props = {
    hostTip: number;
    setHostTip(tip: number): void;

    guestTip: number;
    setGuestTip(tip: number): void;

    voting: VotingData;
};

export const VotePage = ({
    hostTip,
    setHostTip,
    guestTip,
    setGuestTip,
    voting: { hostTeam, guestTeam },
}: Props) => {
    return (
        <Grid
            className={styles.Voting}
            gridProperties={{
                gridTemplateAreas: `
					'TeamCounter HostTeamIcon' 
					'TeamCounter GuestTeamIcon'
				`,
                gap: "1rem",
                gridTemplateColumns: "3fr minmax(100px, 2fr)",
                gridTemplateRows: "minmax(100px, 1fr) minmax(100px, 1fr)",
            }}
        >
            <Cell
                className={styles.VotingSectionContainer}
                cellStyles={{
                    gridArea: "TeamCounter",
                }}
            >
                <Flex className={styles.VotingSection} space="Between" direction="Column">
                    <VoteCounter value={hostTip} setValue={setHostTip} />
                    <VoteCounter value={guestTip} setValue={setGuestTip} />
                </Flex>
            </Cell>
            <Cell
                className={styles.TeamIcon}
                cellStyles={{
                    gridArea: "HostTeamIcon",
                }}
            >
                <img alt={hostTeam.identifier} src={hostTeam.teamIconSource}></img>
            </Cell>
            <Cell
                className={`${styles.TeamIcon} ${styles.GuestTeamIcon}`}
                cellStyles={{
                    gridArea: "GuestTeamIcon",
                }}
            >
                <img alt={guestTeam.identifier} src={guestTeam.teamIconSource}></img>
            </Cell>
        </Grid>
    );
};

export default VotePage;
