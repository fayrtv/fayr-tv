// Framework
import classNames from "classnames";
import { range } from "util/collectionUtil";

import { Flex } from "@fayr/shared-components";

// Styles
import styles from "./AudioSensitivityBar.module.scss";

type Props = {
    segments: number;
    volume: number;
};

export const AudioSensitivityBar = ({ segments, volume }: Props) => {
    // Round the Volume (0-1) to the segment-friendly number
    const normalizedVolume = Math.round(segments * volume);

    return (
        <Flex
            className={styles.AudioSensitivityBar}
            direction="ColumnReverse"
            space="Around"
            crossAlign="Center"
        >
            {range(segments).map((position) => (
                <span
                    className={classNames(styles.Segment, {
                        [styles.Active]: normalizedVolume > position,
                    })}
                    key={position}
                ></span>
            ))}
            <span className={styles.VerticalLine}></span>
        </Flex>
    );
};

export default AudioSensitivityBar;
