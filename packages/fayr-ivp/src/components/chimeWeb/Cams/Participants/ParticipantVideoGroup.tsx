import { CSSProperties } from "react";

import { Cell, Flex, Grid } from "@fayr/common";

import styles from "./ParticipantVideoGroup.module.scss";

import { LocalVideoInfo } from "../types";

type Props = {
    localVideoInfo: LocalVideoInfo;
    participants: Array<JSX.Element>;
};

export const ParticipantVideoGroup = ({ localVideoInfo, participants }: Props) => {
    const participantCount = participants.length;

    if (participantCount <= 3) {
        const heightPercentage = `${100 / participantCount}%`;

        const style: CSSProperties = { height: heightPercentage, maxHeight: heightPercentage };

        return (
            <Flex className={styles.ParticipantVideoGroup} direction="Column">
                {participants.map((video, index) => {
                    if (localVideoInfo.replace && index === localVideoInfo.tile) {
                        return (
                            <div key={index} style={style}>
                                {localVideoInfo.node}
                            </div>
                        );
                    }

                    return (
                        <div key={index} style={style}>
                            {video}
                        </div>
                    );
                })}
            </Flex>
        );
    }

    const rowsRequired = Math.ceil(participantCount / 2);

    const rowPercentage = 100 / rowsRequired;

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
