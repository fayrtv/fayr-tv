import { PlatformConfig, PlatformInfo, PlatformStyling, PlatformType } from "@fayr/api-contracts";
import { FAYR_THEME, useStateWithEffect, uuid } from "@fayr/common";
import { debounce } from "lodash";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "react-query";

type Context = {
    isLoading: boolean;
    isSaving: boolean;
    platformId: string;
    type?: PlatformType;
    setType: Dispatch<SetStateAction<PlatformType | undefined>>;
    info: PlatformInfo;
    setInfo: Dispatch<SetStateAction<PlatformInfo>>;
    styling: PlatformStyling;
    setStyling: Dispatch<SetStateAction<PlatformStyling>>;
};

const defaults: Context = {
    isLoading: false,
    isSaving: false,
    platformId: uuid(),
    type: undefined,
    info: {
        name: undefined,
        companyName: undefined,
        welcomeMessage: undefined,
    },
    setInfo: () => void 0,
    setType: () => void 0,
    styling: { theme: FAYR_THEME, craftData: undefined },
    setStyling: () => void 0,
};

export const PlatformConfiguratorContext = createContext<Context>(defaults);

export const PlatformConfiguratorContextProvider: React.FC = ({ children }) => {
    const [platformId, setPlatformId] = useState<string>(defaults.platformId);

    const [isSaving, setSaving] = useState<boolean>(false);

    const { isLoading, refetch } = useQuery("platform-config", () =>
        fetch(`/api/platforms/${platformId}`, { method: "GET" }).then(async (res) => {
            const result = (await res.json()) as PlatformConfig;

            if (result.id !== platformId) {
                setPlatformId(result.id);
            }
        }),
    );

    const debouncedSave = React.useRef(
        debounce(async (dataToSave: Partial<Omit<PlatformConfig, "id">>) => {
            setSaving(true);
            await fetch(`/api/platforms/${platformId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: platformId, ...dataToSave }),
            });
            await refetch();
            setSaving(false);
        }, 700),
    );

    const [platformInfo, setPlatformInfo] = useStateWithEffect<PlatformInfo>(
        defaults.info,
        React.useCallback((newValue) => {
            setSaving(true);
            return debouncedSave.current({ info: newValue });
        }, []),
    );

    const [platformType, setPlatformTypeAndSave] = useStateWithEffect<PlatformType | undefined>(
        defaults.type,
        React.useCallback((newValue) => {
            setSaving(true);
            debouncedSave.current({ type: newValue });
        }, []),
    );

    const [styling, setStyling] = useStateWithEffect<PlatformStyling>(
        defaults.styling,
        React.useCallback((newValue) => {
            setSaving(true);
            debouncedSave.current({ styling: newValue });
        }, []),
    );

    return (
        <PlatformConfiguratorContext.Provider
            value={{
                isLoading,
                isSaving,
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
