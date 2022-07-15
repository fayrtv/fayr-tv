import { Duration } from "moment";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import isDevMode from "util/isDevMode";

/**
 * @param timestampWithTimezone e.g. "2022-07-16T14:50:00+02:00"
 */
export const isAfterSpecificTimestamp = (timestampWithTimezone: moment.MomentInput) =>
    moment.utc().isAfter(moment.utc(timestampWithTimezone));

export type TimedFeatureToggleParams = (
    | { enabledBefore: moment.MomentInput; enabledAfter?: undefined }
    | { enabledBefore?: undefined; enabledAfter: moment.MomentInput }
    ) & { enabledInDevMode?: boolean };

export const useTimedFeatureToggle = ({
                                          enabledBefore,
                                          enabledAfter,
                                          enabledInDevMode = false,
                                      }: TimedFeatureToggleParams) => {
    const [isEnabled, setEnabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<Duration | undefined>(undefined);

    useEffect(() => {
        const intervalHandle = setInterval(() => {
            const enabled = enabledBefore
                ? !isAfterSpecificTimestamp(enabledBefore!)
                : isAfterSpecificTimestamp(enabledAfter!);

            setEnabled(enabled);

            if ((enabledAfter && enabled) || (enabledBefore && !enabled)) {
                setTimeRemaining(undefined);
                clearInterval(intervalHandle);
                return;
            }

            setTimeRemaining(
                moment.duration(
                    enabledAfter
                        ? moment.utc().diff(moment.utc(enabledAfter))
                        : moment.utc(enabledBefore).diff(moment.utc()),
                ),
            );
        }, 1000);
        return () => {
            try {
                clearInterval(intervalHandle);
            } catch (_) {
                // ok
            }
        };
    }, [enabledBefore, enabledAfter]);

    if (enabledInDevMode && isDevMode) {
        return { isEnabled: true, timeRemaining: undefined };
    }

    return {
        isEnabled,
        timeRemaining,
    };
};
