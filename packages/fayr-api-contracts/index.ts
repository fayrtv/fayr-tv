import { Theme } from "@fayr/common";

export enum PlatformType {
    WatchParty = "wp",
    VideoOnDemand = "vod",
    Hybrid = "hybrid",
}

export type PlatformStyling = {
    theme: Theme;
    craftData?: string;
};

export type PlatformInfo = {
    name?: string;
    companyName?: string;
    // TODO: Translations should probably be handled separately, maybe by sharing JSON files for
    // every language...
    welcomeMessage?: string;
};

export type PlatformIdentity = {
    id: string;
};

export type PlatformConfig = PlatformIdentity & {
    type?: PlatformType;
    info?: PlatformInfo;
    styling?: PlatformStyling;
};
