export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 12;

// Default video stream to play inside the video player
// export const DEFAULT_VIDEO_STREAM = "https://mcdn.daserste.de/daserste/de/master.m3u8";
// export const DEFAULT_VIDEO_STREAM = "https://d1e4t3xfu0q4ky.cloudfront.net/fce11652-5078-4322-8e80-d04a71977b20/AppleHLS1/manunitedintermilan001.m3u8";
export const DEFAULT_VIDEO_STREAM = "https://swrbwhls-i.akamaihd.net/hls/live/667638/swrbwd/master-720p-3628.m3u8"

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
