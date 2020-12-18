export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 12;

// Default video stream to play inside the video player
export const DEFAULT_VIDEO_STREAM = "https://zdf-hls-15.akamaized.net/hls/live/2016498/de/0f8cd85d141c27ece11d2287d7a07bbf/4/4.m3u8";

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'WARN';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
