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

    const isSpecialTestDomain = window.location.hostname === "testing.fayrtv.com";

    useEffect(() => {
        const intervalHandle = setInterval(
            () =>
                setEnabled(
                    enabledBefore
                        ? !isAfterSpecificTimestamp(enabledBefore!)
                        : isAfterSpecificTimestamp(enabledAfter!),
                ),
            10000,
        );
        return () => clearInterval(intervalHandle);
    }, [enabledBefore, enabledAfter]);

    if (isSpecialTestDomain) {
        return true;
    }

    if (enabledInDevMode && isDevMode) {
        return true;
    }

    return isEnabled;
};
