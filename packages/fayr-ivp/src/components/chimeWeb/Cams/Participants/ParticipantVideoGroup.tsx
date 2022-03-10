import { Cell, Grid } from "@fayr/shared-components";

import styles from "./ParticipantVideoGroup.module.scss";

import { LocalVideoInfo } from "../types";

type Props = {
    localVideoInfo: LocalVideoInfo;
    participantVideos: IterableIterator<JSX.Element>;
};

export const ParticipantVideoGroup = ({ localVideoInfo, participantVideos }: Props) => {
    const participants = Array.from(participantVideos);

    const participantCount = participants.length;

    const slotsRequired = Math.ceil(participantCount / 2);

    const rowPercentage = (100 / slotsRequired).toPrecision(2);

    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: `repeat(${slotsRequired}, ${rowPercentage}%)`,
                gridTemplateColumns: "repeat(2, 50%)",
            }}
            className={styles.ParticipantVideoGroup}
        >
            {participants.map((video, index) => {
                if (localVideoInfo.replace && index === localVideoInfo.tile) {
                    return <Cell key={index}>{localVideoInfo.node}</Cell>;
                }

                return <Cell key={index}>{video}</Cell>;
            })}
        </Grid>
    );
};

export default ParticipantVideoGroup;
