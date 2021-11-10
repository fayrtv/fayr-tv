import { makeid } from "util/guidHelper";

export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";
// For local AWS SAM container:
//export const CHIME_ROOM_API = "http://127.0.0.1:5859";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 16;

// Default video stream to play inside the video player
export const DEFAULT_VIDEO_STREAM = "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8"; // Bunny stream
// export const DEFAULT_VIDEO_STREAM = "https://d3fouxdzjpljew.cloudfront.net/out/v1/11d6013fea984a00a36d75ec33e66cc1/12eb4ef2f7cf4f838a5119af953745de/d4183462b7db4490a631cc977efc0508/index.m3u8"; // football stream

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;
export const RANDOM = makeid(8);