import { Cell, Grid } from "@fayr/shared-components";

import styles from "./ParticipantVideoGroup.module.scss";

import { LocalVideoInfo } from "../types";

type Props = {
    localVideoInfo: LocalVideoInfo;
    participantVideos: IterableIterator<JSX.Element>;
};

export const ParticipantVideoGroup = ({ localVideoInfo, participantVideos }: Props) => {
    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: "repeat(5, 20%)",
                gridTemplateColumns: "repeat(2, 50%)",
            }}
            className={styles.ParticipantVideoGroup}
        >
            {Array.from(participantVideos).map((video, index) => {
                if (localVideoInfo.replace && index === localVideoInfo.tile) {
                    return <Cell key={index}>{localVideoInfo.node}</Cell>;
                }

                return <Cell key={index}>{video}</Cell>;
            })}
        </Grid>
    );
};

export default ParticipantVideoGroup;
