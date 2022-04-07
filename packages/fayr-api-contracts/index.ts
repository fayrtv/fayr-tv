import { Theme } from "@fayr/common";

export enum PlatformType {
    WatchParty = "wp",
    VideoOnDemand = "vod",
    Hybrid = "hybrid",
}

export type PlatformStyling = {
    theme: Theme;
};

export type PlatformInfo = {
    name?: string;
    companyName?: string;
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
