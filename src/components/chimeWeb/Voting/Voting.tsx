// Framework
import { useMediaQuery } from "react-responsive";
import * as React from "react";

// Components
import Grid from "components/common/GridLayout/Grid";
import Cell from "components/common/GridLayout/Cell";
import Flex from "components/common/Flex";
import MaterialIcon from "components/common/MaterialIcon";
import VotePage from "./SubPages/VotePage";
import VotingMenuEntry from "./VotingMenuEntry";
import OverviewPage from "./SubPages/OverviewPage";
import SurveyPage from "./SubPages/SurveyPage";

// Types
import { VotingData, VotingPage } from "./types";

// Styles
import styles from "./styles/Voting.module.scss";

type Props = {
    votingRef: React.RefObject<HTMLDivElement>;
    voting: VotingData;

    updateTip(hostTeam: number, guestTeam: number): void;
    closeVoting(): void;
};

type MenuEntry = {
    content: React.ReactNode;
    page: VotingPage;
};

export const Voting = ({ votingRef, closeVoting, voting, updateTip }: Props) => {
    const [hostTip, setHostTip] = React.useState(0);
    const [guestTip, setGuestTip] = React.useState(0);
    const [votingPage, setVotingPage] = React.useState(VotingPage.Vote);
    const isDesktop = useMediaQuery({ minWidth: 961 });

    const onTip = () => {
        if (votingPage !== VotingPage.Vote) {
            setVotingPage(VotingPage.Vote);
            return;
        }

        updateTip(hostTip, guestTip);
    };

    const menuEntries = React.useMemo(
        () =>
            new Array<MenuEntry>(
                {
                    content: isDesktop ? (
                        <span>Tippen</span>
                    ) : (
                        <MaterialIcon type="Outlined" color="white" iconName="ballot" />
                    ),
                    page: VotingPage.Vote,
                },
                {
                    content: isDesktop ? (
                        <span>Übersicht</span>
                    ) : (
                        <MaterialIcon type="Outlined" color="white" iconName="menu" />
                    ),
                    page: VotingPage.Overview,
                },
                {
                    content: isDesktop ? (
                        <span>Umfrage</span>
                    ) : (
                        <MaterialIcon type="Outlined" color="white" iconName="poll" />
                    ),
                    page: VotingPage.Survey,
                },
            ),
        [],
    );

    return (
        <Flex
            direction="Column"
            crossAlign="Center"
            className={styles.VotingWrapper}
            ref={votingRef}
        >
            <Grid
                className={styles.Voting}
                gridProperties={{
                    gridTemplateAreas: `
						'MenuSection Content Content' 
						'MenuSection Content Content'
						'ButtonSection ButtonSection ButtonSection'
					`,
                    gap: "1rem",
                    gridTemplateColumns: `${isDesktop ? "2fr" : "35px"} 3fr minmax(100px, 2fr)`,
                    gridTemplateRows: "minmax(100px, 1fr) minmax(100px, 1fr)",
                }}
            >
                <Cell
                    cellStyles={{
                        gridArea: "MenuSection",
                    }}
                >
                    <Flex direction="Column" className={styles.VotingMenuEntryContainer}>
                        {menuEntries.map((x, i) => (
                            <VotingMenuEntry
                                {...x}
                                key={i}
                                selectedPage={votingPage}
                                setVotingPage={setVotingPage}
                            />
                        ))}
                    </Flex>
                </Cell>
                <Cell
                    cellStyles={{
                        gridArea: "Content",
                    }}
                >
                    {votingPage === VotingPage.Vote ? (
                        <VotePage
                            guestTip={guestTip}
                            hostTip={hostTip}
                            setGuestTip={setGuestTip}
                            setHostTip={setHostTip}
                            voting={voting}
                        />
                    ) : votingPage === VotingPage.Overview ? (
                        <OverviewPage voting={voting} />
                    ) : (
                        <SurveyPage />
                    )}
                </Cell>
                <Cell
                    cellStyles={{
                        gridArea: "ButtonSection",
                    }}
                >
                    <Flex direction="Row" mainAlign="Center" crossAlign="Center">
                        <div onClick={onTip} className={styles.TipButton}>
                            <span>TIP SETZEN</span>
                        </div>
                        <div className={styles.CloseButton} onClick={closeVoting}>
                            <MaterialIcon size={30} color="white" iconName="close" />
                        </div>
                    </Flex>
                </Cell>
            </Grid>
        </Flex>
    );
};

export default Voting;
