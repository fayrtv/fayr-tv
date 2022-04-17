// Framework
import { Flex, MaterialIcon } from "@fayr/common";

// Styles
import styles from "./AudioSensitivityBar.module.scss";

type Props = {
    volume: number;
};

export const AudioSensitivityBar = ({ volume }: Props) => {
    const volumePercentage = Math.round(volume * 100);

    return (
        <Flex className={styles.Container} direction="Row" crossAlign="Center">
            <MaterialIcon color="white" iconName="mic" />
            <span className={styles.HorizontalLine}>
                <span
                    className={styles.VolumeIndicator}
                    style={{ width: `${volumePercentage}%` }}
                />
            </span>
        </Flex>
    );
};

export default AudioSensitivityBar;
