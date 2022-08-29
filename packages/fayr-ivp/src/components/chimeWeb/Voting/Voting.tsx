import * as config from "config";
import * as React from "react";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

import useSlidingTimeout from "hooks/useSlidingTimeout";

import { Cell, Flex, Grid, MaterialIcon, EaseInOutCheckmark } from "@fayr/common";

import styles from "./styles/Voting.module.scss";

import useTranslations from "../../../hooks/useTranslations";
import OverviewPage from "./SubPages/OverviewPage";
import SurveyPage from "./SubPages/SurveyPage";
import VotePage from "./SubPages/VotePage";
import VotingMenuEntry from "./VotingMenuEntry";
import { VotingData, VotingPage } from "./types";

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

const PositionedCheckMark = styled(EaseInOutCheckmark)`
    position: absolute;
    right: 2rem;
`;

export const Voting = ({ votingRef, closeVoting, voting, updateTip }: Props) => {
    const [hostTip, setHostTip] = React.useState(0);
    const [guestTip, setGuestTip] = React.useState(0);
    const [votingPage, setVotingPage] = React.useState(VotingPage.Vote);
    const [showTipFeedback, setShowTipFeedback] = React.useState(false);
    const isDesktop = useMediaQuery({ minWidth: 961 });

    const tl = useTranslations();
    const setSlidingTimeout = useSlidingTimeout();

    const onTip = () => {
        if (votingPage !== VotingPage.Vote) {
            setVotingPage(VotingPage.Vote);
            return;
        }

        updateTip(hostTip, guestTip);
        setShowTipFeedback(true);
        setSlidingTimeout(() => setShowTipFeedback(false), 1000);
    };

    const menuEntries = React.useMemo(() => {
        const menuEntries = new Array<MenuEntry>(
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
        );

        if (config.ShowUmfrage) {
            menuEntries.push({
                content: isDesktop ? (
                    <span>Umfrage</span>
                ) : (
                    <MaterialIcon type="Outlined" color="white" iconName="poll" />
                ),
                page: VotingPage.Survey,
            });
        }

        return menuEntries;
    }, [isDesktop]);

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
                            <span>{tl.VotingSetTip}</span>
                            {showTipFeedback && (
                                <PositionedCheckMark size="6rem" color="darkgreen" />
                            )}
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
