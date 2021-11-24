// Components
import ParticipantVideo from "./ParticipantVideo";
import Cell from "components/common/GridLayout/Cell";
import Grid from "components/common/GridLayout/Grid";

// Types
import { IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";
import { LocalVideoInfo, Roster } from "../types";

// Styles
import styles from "./ParticipantVideoGroup.module.scss";

type Props = {
    chime: IChimeSdkWrapper;
    roster: Roster;
    localVideoInfo: LocalVideoInfo;
    pin(id: string): void;
};

export const ParticipantVideoGroup = ({ chime, roster, pin, localVideoInfo }: Props) => {
    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: "repeat(5, 1fr)",
                gridTemplateColumns: "repeat(2, 50%)",
            }}
            className={styles.ParticipantVideoGroup}
        >
            {roster.slice(0, 10).map((attendee, index) => {
                if (localVideoInfo.replace && index === localVideoInfo.tile) {
                    return <Cell key={index}>{localVideoInfo.node}</Cell>;
                }

                return (
                    <Cell key={index}>
                        <ParticipantVideo
                            chime={chime}
                            tileIndex={index}
                            key={index}
                            attendeeId={attendee.attendeeId}
                            videoEnabled={attendee.videoEnabled}
                            name={attendee.name}
                            muted={attendee.muted}
                            volume={attendee.volume}
                            videoElement={attendee.videoElement}
                            pin={pin}
                        />
                    </Cell>
                );
            })}
        </Grid>
    );
};

export default ParticipantVideoGroup;
