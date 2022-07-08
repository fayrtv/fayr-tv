import { sample } from "lodash";
import { makeid } from "util/guidHelper";

export const BASE_HREF = "";

export const API_BASE_URL = "https://h9iohvkr9b.execute-api.us-east-1.amazonaws.com/dev/v1/";

// API endpoint for retrieving the attendees list, joining the room, and ending the room.
// Value without trailing slash.
export const CHIME_ROOM_API = "https://iyte6naueg.execute-api.eu-central-1.amazonaws.com/Prod/"
    .trim()
    .replace(/\/$/, "");
// For local AWS SAM container:
//export const CHIME_ROOM_API = "http://127.0.0.1:5859";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 16;

// Default video stream to play inside the video player

export const DEFAULT_VIDEO_STREAM = sample([
    // Das Erste
    // "https://mcdn.daserste.de/daserste/de/master_1920p_5128.m3u8",
    // Bunny stream
    // "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8",
    // ARTE
    // "https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/index.m3u8",
    // KIKA
    // "https://kikageohls.akamaized.net/hls/live/2022693/livetvkika_de/master.m3u8",
    // Tagesschau 24
    "https://tagesschau.akamaized.net/hls/live/2020117/tagesschau/tagesschau_3/master_720.m3u8",
    // Amazon IVS
    // "https://5f1b94db7198.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.676057042583.channel.hWxKBDpLJc9h.m3u8",
    // AWS Elemental MediaLive
    // "https://528dc4ef17d725ed.mediapackage.eu-central-1.amazonaws.com/out/v1/2ff189e75e344a229c386c0af778e623/index.m3u8",
]) as string;

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://3n1wh2j0ae.execute-api.eu-central-1.amazonaws.com/Prod ";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = "DEBUG";

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
export const RANDOM = makeid(8);

export const HighlightVideoAlignment: "Top" | "Bottom" = "Bottom";
export const HostPinningFeatureEnabled: boolean = false;
export const ShowStartScreen: boolean = true;
export const ShowUmfrage: boolean = false;
export const ShowReactionButton: boolean = false;

export type StreamSyncOptions = {
    // Type of synchronization
    streamSynchronizationType: "None" | "Static" | "LiveStream";
    // Interval for how often a heartbeat is shared
    heartBeatInterval: number;
    // Threshold in seconds after which a participant is considered lost/unhealthy
    heartBeatInactiveThreshold: number;
    // Interval for synchronization of position among attendees
    synchronizationInterval: number;
    // Whether diagnostics logging is enabled
    loggingEnabled: boolean;
    // Config for live stream
    liveStream: {
        // The minimum time distance from the attendee ahead at which to start synchronizing streams
        minimumDrift: number;
    };
    // Config for static video source
    staticStream: {
        // The maximum amount of seconds we can diverge from the most up to date attendee
        minimumDrift: number;
    };
};

export const streamSync: StreamSyncOptions = {
    streamSynchronizationType: "LiveStream",
    heartBeatInterval: 1000,
    heartBeatInactiveThreshold: 30,
    synchronizationInterval: 1000,
    loggingEnabled: DEBUG && true,
    liveStream: {
        minimumDrift: 1.0,
    },
    staticStream: {
        minimumDrift: 1,
    },
};
