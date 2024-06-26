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

    const isSpecialTestDomain = window.location.hostname === "testing.fayrtv.com";

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
                        ? moment.utc(enabledAfter).diff(moment.utc())
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

    if (isSpecialTestDomain) {
        if (enabledAfter) {
            return { isEnabled: true, timeRemaining: undefined };
        }
        if (enabledBefore) {
            return { isEnabled: false, timeRemaining: undefined };
        }
    }

    if (enabledInDevMode && isDevMode) {
        return { isEnabled: true, timeRemaining: undefined };
    }

    return {
        isEnabled,
        timeRemaining,
    };
};

export const formatDiffAsCountdown = (timeRemaining: Duration): string => {
    if (timeRemaining.as("s") <= 0) {
        return "";
    }

    const parts = [];

    if (timeRemaining.as("s") > 3600) {
        parts.push(timeRemaining.hours().toString().padStart(2, "0"));
    }
    if (timeRemaining.as("s") > 60) {
        parts.push(timeRemaining.minutes().toString().padStart(2, "0"));
    }
    parts.push(timeRemaining.seconds().toString().padStart(2, "0"));

    return parts.join(":");
};
