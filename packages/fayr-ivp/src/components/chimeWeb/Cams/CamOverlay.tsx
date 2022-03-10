// Framework
import styled from "styled-components";

import styles from "./CamOverlay.module.scss";

import { ActivityState } from "./types";

const CenteredContainerDiv = styled.div`
    display: grid;
    place-items: center;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgb(0, 0, 0);
    background: radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    opacity: 0.9;
    backdrop-filter: blur(10px);
    transition: background 0.5s ease-in-out;
`;

const OverlaySpan = styled.span`
    font-size: 5rem;
`;

type Props = {
    activityState: ActivityState;
};

export const CamOverlay = ({ activityState }: Props) => {
    let info: string;

    switch (activityState) {
        case ActivityState.AwayFromKeyboard:
            info = "AFK";
            break;
        default:
            info = "";
    }

    return (
        <CenteredContainerDiv className={styles.FadeInOut}>
            <OverlaySpan>{info}</OverlaySpan>
        </CenteredContainerDiv>
    );
};

export default CamOverlay;
