import classNames from "classnames";
import * as config from "config";
import React from "react";
import { useMediaQuery } from "react-responsive";

import { SupportButton } from "components/chimeWeb/Controls/Buttons/SupportButton";

import { Cell, Flex, Grid } from "@fayr/common";

import styles from "./Controls.module.scss";

import { ChatOpenContext } from "../../contexts/ChatOpenContext";
import { useIsMobileLandscape, useIsMobilePortrait, useIsTabletPortrait } from "../../mediaQueries";
// Buttons
import CamToggleButton from "./Buttons/CamToggleButton";
import ChatButton from "./Buttons/ChatButton";
import MicrophoneToggleButton from "./Buttons/MicrophoneToggleButton";
import SettingsButton from "./Buttons/SettingsButton";
import SharePartyButton from "./Buttons/SharePartyButton";
import VotingButton from "./Buttons/VotingButton";
import ReactionButton from "./emoji-reactions/ReactionButton";

type Props = {
    title: string;
    attendeeId: string;
    openSettings(): void;
    fullScreen?: boolean;
};

const Controls: React.FC<Props> = ({ title, attendeeId, openSettings, fullScreen = false }) => {
    const { isOpen: isChatOpen, set: setChatOpen } = React.useContext(ChatOpenContext);

    const isMobileLandscape = useIsMobileLandscape();
    const isMobilePortrait = useIsMobilePortrait();
    const isTabletPortrait = useIsTabletPortrait();

    const controlsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (controlsRef.current) {
            let touchDownX: number | null = null;

            const handleTouchStart = (event: TouchEvent) => {
                const { clientX } = event.touches[0];
                touchDownX = clientX;
            };

            const handleTouchMove = (event: TouchEvent) => {
                if (!touchDownX) {
                    return;
                }

                const { clientX: xUp } = event.touches[0];

                var xDiff = touchDownX - xUp;

                if (Math.abs(xDiff) > 30)
                    if (isChatOpen && xUp > touchDownX) {
                        setChatOpen(false);
                    } else if (!isChatOpen && xUp < touchDownX) {
                        setChatOpen(true);
                    }
            };

            const controlRef = controlsRef.current;

            controlRef.ontouchstart = handleTouchStart;
            controlRef.ontouchmove = handleTouchMove;

            return () => {
                controlRef.removeEventListener("touchstart", handleTouchStart);
                controlRef.removeEventListener("touchmove", handleTouchMove);
            };
        }
    }, [isChatOpen, isMobileLandscape, setChatOpen]);

    const chatButton = <ChatButton key="ChatButton" />;

    const buttons = [
        <MicrophoneToggleButton key="MicrophoneToggleButton" />,
        <CamToggleButton key="CamToggleButton" />,
        // {/* Setting button */}
        !fullScreen ? (
            <SettingsButton openSettings={openSettings} key="SettingsButton" />
        ) : (
            React.Fragment
        ),
        !fullScreen ? <SharePartyButton title={title} key="SharePartyButton" /> : React.Fragment,
        !fullScreen ? <SupportButton key="SupportButton" /> : React.Fragment,
        !isMobilePortrait && !fullScreen ? chatButton : React.Fragment,
        config.ShowReactionButton ? <ReactionButton key="ReactionButton" /> : React.Fragment,
        // Voting Button
        !fullScreen ? <VotingButton attendeeId={attendeeId} key="VotingButton" /> : React.Fragment,
    ];

    return (
        <Flex
            direction="Row"
            mainAlign="Center"
            className={classNames(styles.Controls, { [styles.ChatOpen]: isChatOpen })}
            onClick={(e: any) => {
                if (isMobileLandscape) {
                    e.stopPropagation();
                    e.preventDefault();
                    setChatOpen(!isChatOpen);
                }
            }}
            ref={controlsRef}
        >
            {((isTabletPortrait && !isChatOpen) || !isTabletPortrait) && (
                <a href="https://trikot.vfb.de/heim" target="_blank">
                    <img
                        src={require("../../../assets/VfB-Heimtrikot.png")}
                        alt="Das neue VfB Heimtrikot"
                        className={styles.VfBIcon}
                    />
                </a>
            )}
            {(isMobileLandscape || isTabletPortrait) && isChatOpen && !fullScreen && (
                <Flex direction="Row" mainAlign="Start" className={styles.ControlsMinified}>
                    <Grid
                        className={styles.ControlsMinifiedBlock}
                        gridProperties={{
                            gridTemplateRows: "50% 50%",
                            gridTemplateColumns: "33% 33% 33%",
                            gap: 0,
                        }}
                    >
                        {buttons.slice(0, 5).map((x, index) => (
                            <Cell key={index} className={styles.MinifiedControlButtonCell}>
                                {x}
                            </Cell>
                        ))}
                    </Grid>
                    {chatButton}
                </Flex>
            )}
            {(!(isMobileLandscape || isTabletPortrait) ||
                ((isMobileLandscape || isTabletPortrait) && !isChatOpen) ||
                ((isMobileLandscape || isTabletPortrait) && fullScreen)) &&
                buttons}
        </Flex>
    );
};

export default Controls;
