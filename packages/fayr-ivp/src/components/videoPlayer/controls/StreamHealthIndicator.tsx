import { MediaPlayer } from "amazon-ivs-player";
import classNames from "classnames";
import * as React from "react";

import { Flex, MaterialIcon } from "@fayr/common";

import styles from "./StreamHealthIndicator.module.scss";

import { DriftInformation, IDriftSyncStrategy } from "../driftSyncStrategies/interfaces";

type Props = {
    player: MediaPlayer | undefined;
    driftSyncStrategy: IDriftSyncStrategy<number>;
};

export const StreamHealthIndicator = ({ player, driftSyncStrategy }: Props) => {
    const [drift, setDrift] = React.useState<DriftInformation<number>>();

    const onSyncClicked = React.useCallback(() => {
        if (!player) {
            return;
        }
        driftSyncStrategy.synchronizeWithOthers(player, []);
    }, [player, driftSyncStrategy]);

    React.useEffect(() => {
        driftSyncStrategy.measurementChange.register(setDrift);
        return () => driftSyncStrategy.measurementChange.unregister(setDrift);
    }, [driftSyncStrategy]);

    return (
        <Flex
            className={classNames(styles.Container, "player-btn mg-x-1")}
            direction="Row"
            crossAlign="Center"
        >
            {drift?.driftedPastBoundary && (
                <MaterialIcon color="white" iconName="sync" onClick={onSyncClicked} />
            )}
            <span className="mr-2 select-none">
                {drift?.driftedPastBoundary ? `- ${drift!.measurement.toFixed(0)} s` : "Live"}
            </span>
            <span
                className={classNames(
                    styles.LiveDot,
                    "mr-3 ml-2",
                    drift?.driftedPastBoundary ? styles.Drifted : styles.Live,
                )}
            />
        </Flex>
    );
};

export default StreamHealthIndicator;
