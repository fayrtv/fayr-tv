export enum PlatformType {
    WatchParty = "wp",
    VideoOnDemand = "vod",
    Hybrid = "hybrid",
}

export function formatPlatformType(type: PlatformType) {
    switch (type) {
        case PlatformType.WatchParty:
            return "Watch Party";
        case PlatformType.VideoOnDemand:
            return "Video-on-Demand";
        case PlatformType.Hybrid:
            return "Hybrid";
        default:
            throw new Error("Unknown platform type");
    }
}
