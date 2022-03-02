import { sample } from "lodash";
import { makeid } from "util/guidHelper";

export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room.
// Value without trailing slash.
export const CHIME_ROOM_API = "https://enb885lh75.execute-api.eu-central-1.amazonaws.com/Prod";
// For local AWS SAM container:
//export const CHIME_ROOM_API = "http://127.0.0.1:5859";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 16;

// Default video stream to play inside the video player

export const DEFAULT_VIDEO_STREAM = sample([
    // Das Erste
    // "https://mcdn.daserste.de/daserste/de/master_1920p_5128.m3u8",
    // Bunny stream
    "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8",
    // ARTE
    // "https://artesimulcast.akamaized.net/hls/live/2030993/artelive_de/index.m3u8",
    // KIKA
    // "https://kikageohls.akamaized.net/hls/live/2022693/livetvkika_de/master.m3u8",
    // Tagesschau 24
    // "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8",
]) as string;

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://glql810lxg.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = "DEBUG";

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
export const RANDOM = makeid(8);

export const HighlightVideoAlignment: "Top" | "Bottom" = "Bottom";
export const HostPinningFeatureEnabled: boolean = false;
export const ShowStartScreen: boolean = true;
export const StreamSynchronizationType: "None" | "Static" | "LiveStream" = "LiveStream";
