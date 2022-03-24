import React from "react";
import { useMediaQuery } from "react-responsive";

import { IAudioVideoManager } from "components/chime/AudioVideoManager";
import { IChimeAudioVideoProvider, IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";

import { Cell, Flex, Grid } from "@fayr/shared-components";

import styles from "./Controls.module.scss";

import { RoomMemberRole } from "../../../types/Room";
import { IDeviceProvider } from "../../chime/ChimeSdkWrapper";
import { ChatOpenContext } from "../../contexts/ChatOpenContext";
// Buttons
import CamToggleButton from "./Buttons/CamToggleButton";
import ChatButton from "./Buttons/ChatButton";
import EndPartyButton from "./Buttons/EndPartyButton";
import MicrophoneToggleButton from "./Buttons/MicrophoneToggleButton";
import SettingsButton from "./Buttons/SettingsButton";
import SharePartyButton from "./Buttons/SharePartyButton";
import VotingButton from "./Buttons/VotingButton";
import ReactionButton from "./emoji-reactions/ReactionButton";

type Props = {
    chime: IChimeSdkWrapper & IChimeAudioVideoProvider & IAudioVideoManager & IDeviceProvider;
    title: string;
    openSettings(): void;
    role: RoomMemberRole;
    ssName: string;
    baseHref: string;
};

const Controls: React.FC<Props> = ({ chime, title, openSettings, role, ssName, baseHref }) => {
    const { isOpen: isChatOpen, set: setChatOpen } = React.useContext(ChatOpenContext);

    const isMobile = useMediaQuery({ maxWidth: 1024 });

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
    }, [isChatOpen, isMobile, setChatOpen]);

    const chatButton = <ChatButton key="ChatButton" />;

    const buttons = [
        <MicrophoneToggleButton chime={chime} key="MicrophoneToggleButton" />,
        <CamToggleButton chime={chime} key="CamToggleButton" />,
        // {/* Setting button */}
        <SettingsButton openSettings={openSettings} key="SettingsButton" />,
        <SharePartyButton title={title} key="SharePartyButton" />,
        chatButton,
        <ReactionButton key="ReactionButton" />,
        // Voting Button
        <VotingButton key="VotingButton" />,
        // End button
        <EndPartyButton
            chime={chime}
            ssName={ssName}
            role={role}
            baseHref={baseHref}
            title={title}
            key="EndPartyButton"
        />,
    ];

    return (
        <Flex
            direction="Row"
            mainAlign="Center"
            className={styles.Controls}
            onClick={(e: any) => {
                if (isMobile) {
                    e.stopPropagation();
                    e.preventDefault();
                    setChatOpen(!isChatOpen);
                }
            }}
            ref={controlsRef}
        >
            <img
                className={styles.FayrIcon}
                src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
                alt="fayrtv-logo"
            />
            {isMobile && isChatOpen && (
                <Flex direction="Row" mainAlign="Start" className={styles.ControlsMinified}>
                    <Grid
                        className={styles.ControlsMinifiedBlock}
                        gridProperties={{
                            gridTemplateRows: "50% 50%",
                            gridTemplateColumns: "50% 50%",
                            gap: 0,
                        }}
                    >
                        {buttons.slice(0, 4).map((x, index) => (
                            <Cell key={index} className={styles.MinifiedControlButtonCell}>
                                {x}
                            </Cell>
                        ))}
                    </Grid>
                    {chatButton}
                </Flex>
            )}
            {(!isMobile || (isMobile && !isChatOpen)) && buttons}
        </Flex>
    );
};

export default Controls;
