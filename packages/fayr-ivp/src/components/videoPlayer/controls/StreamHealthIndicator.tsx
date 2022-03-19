// Framework
import { MediaPlayer } from "amazon-ivs-player";
import classNames from "classnames";
import * as React from "react";

import { MaterialIcon } from "@fayr/shared-components";
// Components
import { Flex } from "@fayr/shared-components/lib";

// Styles
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
        if (!player) {
            return;
        }

        const handle = window.setInterval(() => {
            setDrift(driftSyncStrategy.measureOwnDrift(player));
        }, 1000);

        return () => window.clearInterval(handle);
    }, [driftSyncStrategy, player]);

    return (
        <Flex
            className={classNames(styles.Container, "player-btn")}
            direction="Row"
            crossAlign="Center"
        >
            <span
                className={classNames(
                    styles.LiveDot,
                    "mr-3 ml-2",
                    drift?.driftedPastBoundary ? styles.Drifted : styles.Live,
                )}
            />
            <span className="mr-2 select-none">
                {drift?.driftedPastBoundary ? `- ${drift!.measurement.toFixed(0)} s` : "Live"}
            </span>
            {drift?.driftedPastBoundary && (
                <MaterialIcon color="white" iconName="sync" onClick={onSyncClicked} />
            )}
        </Flex>
    );
};

export default StreamHealthIndicator;
