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
export const DEFAULT_VIDEO_STREAM =
    // "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8"; // Bunny stream
    "https://derste247liveut.akamaized.net/hls/live/662734/daserste_ut_de/profile1/1.m3u8";
// "https://d28sview69mbeg.cloudfront.net/out/v1/fb897095f5694811aafc46559c73eb92/06e44b4ba491459eb00225489144f254/e5b56f6d2c7a491d9786cfdc86a2c5e5/index.m3u8"; // Inter Milan vs. Man United
// "https://ea6f7e87fe3e.eu-west-1.playback.live-video.net/api/video/v1/eu-west-1.676057042583.channel.KeSLVW8GAv39.m3u8"; // Elgato stream

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://glql810lxg.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = "DEBUG";

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
export const RANDOM = makeid(8);

export const HighlightVideoAlignment: "Top" | "Bottom" = "Bottom";
