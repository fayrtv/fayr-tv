import { Cell, Grid } from "@fayr/common";

import styles from "./ParticipantVideoGroup.module.scss";

import { LocalVideoInfo } from "../types";

type Props = {
    localVideoInfo: LocalVideoInfo;
    participantVideos: IterableIterator<JSX.Element>;
};

export const ParticipantVideoGroup = ({ localVideoInfo, participantVideos }: Props) => {
    const participants = Array.from(participantVideos);

    const participantCount = participants.length;

    const rowsRequired = Math.ceil(participantCount / 2);

    const rowPercentage = Math.ceil(100 / rowsRequired);

    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: `repeat(${rowsRequired}, ${rowPercentage}%)`,
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
