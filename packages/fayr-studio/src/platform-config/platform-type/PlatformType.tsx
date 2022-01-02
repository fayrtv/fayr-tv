export enum PlatformType {
    WatchParty,
    VideoOnDemand,
    Hybrid,
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
