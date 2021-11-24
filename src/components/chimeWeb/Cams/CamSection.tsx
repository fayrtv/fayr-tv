// Framework
import React from "react";

// Components
import LocalVideo from "./LocalVideo/LocalVideo";
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
    const localVideo = (
        <div className={styles.HighlightVideoWrapper}>
            <LocalVideo key="HighlightVideo" chime={chime} joinInfo={joinInfo} />
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
                    {localVideo}
                    {participantVideo}
                </>
            ) : (
                <>
                    {participantVideo}
                    {localVideo}
                </>
            )}
        </div>
    );
};

export default CamSection;
