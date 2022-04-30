import { PlatformConfig, PlatformType } from "@fayr/api-contracts";
import { API_BASE_URL } from "config";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";

import useTranslations from "hooks/useTranslations";

import { FAYR_THEME } from "@fayr/common";

export const usePlatformConfig = () => {
    const { params } = useRouteMatch<{ platform?: string }>();

    const platformId = params.platform;

    const { isLoading, data } = useQuery<PlatformConfig>("platform-config", async () => {
        if (!platformId) {
            return undefined;
        }

        const result = await fetch(`${API_BASE_URL}platforms/${platformId}`);
        return await result.json();
    });

    const tl = useTranslations();

    const defaultFayrConfig = useMemo(
        () =>
            ({
                id: "default",
                info: {
                    name: "FAYR",
                    companyName: "FAYR GmbH",
                    welcomeMessage: tl.WelcomeMessageBody,
                },
                styling: {
                    theme: FAYR_THEME,
                },
                type: PlatformType.WatchParty,
            } as PlatformConfig),
        [tl],
    );

    return { isLoading, platformConfig: platformId ? data : defaultFayrConfig };
};
