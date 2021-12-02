// Components
import Cell from "components/common/GridLayout/Cell";
import Grid from "components/common/GridLayout/Grid";

// Types
import { LocalVideoInfo } from "../types";

// Styles
import styles from "./ParticipantVideoGroup.module.scss";

type Props = {
    localVideoInfo: LocalVideoInfo;
    participantVideos: IterableIterator<JSX.Element>;
};

export const ParticipantVideoGroup = ({ localVideoInfo, participantVideos }: Props) => {
    return (
        <Grid
            gridProperties={{
                gap: 0,
                gridTemplateRows: "repeat(5, 1fr)",
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
