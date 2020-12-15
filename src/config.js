export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://t7b37v25pa.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 12;

// Default video stream to play inside the video player
export const DEFAULT_VIDEO_STREAM = "https://tagesschau-lh.akamaihd.net/i/tagesschau_3@66339/index_3776_av-p.m3u8?sd=10&rebase=on";

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://qqyfe2oy3c.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'WARN';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
