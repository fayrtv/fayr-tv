export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://t7b37v25pa.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 48;

// Default video stream to play inside the video player
// export const DEFAULT_VIDEO_STREAM = "https://1404752763.rsc.cdn77.org/iiVEFalgIOYzctrRZUjF6Q==,1606851798/ls-45420-1/tracks-v1a1/mono.m3u8";
// export const DEFAULT_VIDEO_STREAM = "https://testamplifyvode-dev-output-1pqi1hdc.s3-eu-west-1.amazonaws.com/000001/000001_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_3500Kbps.m3u8"
export const DEFAULT_VIDEO_STREAM = "https://testamplifyvode-dev-output-1pqi1hdc.s3-eu-west-1.amazonaws.com/stream/index.m3u8"

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://qqyfe2oy3c.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = true;
