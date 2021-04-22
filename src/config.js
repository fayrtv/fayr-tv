export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 12;

// Default video stream to play inside the video player
// export const DEFAULT_VIDEO_STREAM = "https://mcdn.daserste.de/daserste/de/master.m3u8";
export const DEFAULT_VIDEO_STREAM = "https://d1nucbbxid94su.cloudfront.net/out/v1/5128994176b14c248f5aafa8ecd2f65e/ff80eaa188e54de9912916e85c71e7a1/a552eac1138343db8f4324bfeee01b57/index.m3u8";

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
