import { PlatformConfig, PlatformInfo, PlatformStyling, PlatformType } from "@fayr/api-contracts";
import { FAYR_THEME, useStateWithEffect, uuid } from "@fayr/shared-components";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "react-query";

type Context = {
    isLoading: boolean;
    platformId: string;
    type?: PlatformType;
    setType: Dispatch<SetStateAction<PlatformType | undefined>>;
    info: PlatformInfo;
    setInfo: Dispatch<SetStateAction<PlatformInfo>>;
    styling: PlatformStyling;
    setStyling: Dispatch<SetStateAction<PlatformStyling>>;
};

const defaults = {
    isLoading: false,
    platformId: uuid(),
    type: undefined,
    info: {
        name: undefined,
        companyName: undefined,
        welcomeMessage: undefined,
    },
    setInfo: () => void 0,
    setType: () => void 0,
    styling: { theme: FAYR_THEME },
    setStyling: () => void 0,
};

export const PlatformConfiguratorContext = createContext<Context>(defaults);

export const PlatformConfiguratorContextProvider: React.FC = ({ children }) => {
    const [platformId, setPlatformId] = useState<string>(defaults.platformId);

    const { isLoading, refetch } = useQuery("platform-config", () =>
        fetch(`/api/platforms/${platformId}`, { method: "GET" }).then(async (res) => {
            const result = (await res.json()) as PlatformConfig;

            if (result.id !== platformId) {
                setPlatformId(result.id);
            }
        }),
    );

    // TODO: debounce these

    const [platformInfo, setPlatformInfo] = useStateWithEffect<PlatformInfo>(
        defaults.info,
        React.useCallback(
            async (newValue: PlatformInfo) => {
                await fetch(`/api/platforms/${platformId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id: platformId, info: newValue }),
                });
                await refetch();
            },
            [platformId, refetch],
        ),
    );

    const [platformType, setPlatformTypeAndSave] = useStateWithEffect<PlatformType | undefined>(
        defaults.type,
        React.useCallback(
            async (newValue: PlatformType | undefined) => {
                await fetch(`/api/platforms/${platformId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id: platformId, type: newValue }),
                });
                await refetch();
            },
            [platformId, refetch],
        ),
    );

    const [styling, setStyling] = useStateWithEffect<PlatformStyling>(
        defaults.styling,
        React.useCallback(
            async (newValue: PlatformStyling) => {
                await fetch(`/api/platforms/${platformId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id: platformId, styling: newValue }),
                });
                await refetch();
            },
            [platformId, refetch],
        ),
    );

    return (
        <PlatformConfiguratorContext.Provider
            value={{
                isLoading,
                platformId,
                type: platformType,
                setType: setPlatformTypeAndSave,
                info: platformInfo,
                setInfo: setPlatformInfo,
                styling,
                setStyling,
            }}
        >
            {children}
        </PlatformConfiguratorContext.Provider>
    );
};

export default PlatformConfiguratorContextProvider;
