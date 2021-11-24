// Framework
import * as React from "react";

// Components
import Flex from "components/common/Flex";
import HighlightVideo from "./HighlightVideo/HighlightVideo";
import ParticipantVideoGroup from "./Participants/ParticipantVideoGroup";

// Functionality
import * as config from "config";

// Styles
import styles from "./CamSection.module.scss";
import { JoinInfo } from "../types";

type Props = {
    chime: any;
    joinInfo: JoinInfo;
};

export const CamSection = ({ chime, joinInfo }: Props) => {
    const highlightVideo = (
        <div className={styles.HighlightVideoWrapper}>
            <HighlightVideo key="HighlightVideo" chime={chime} joinInfo={joinInfo} />
        </div>
    );

    const participantVideo = (
        <div className={styles.ParticipantVideoWrapper}>
            <ParticipantVideoGroup key="ParticipantVideoGroup" chime={chime} joinInfo={joinInfo} />
        </div>
    );

    return (
        <div className={styles.CamSection}>
            {config.HighlightVideoAlignment === "Top" ? (
                <>
                    {highlightVideo}
                    {participantVideo}
                </>
            ) : (
                <>
                    {participantVideo}
                    {highlightVideo}
                </>
            )}
        </div>
    );
};

export default CamSection;
