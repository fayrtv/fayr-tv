import { PlatformConfig } from "@fayr/api-contracts";
import { API_BASE_URL } from "config";
import React from "react";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";

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

    return { isLoading, platformConfig: data };
};
