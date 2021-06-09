export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 12;

// Default video stream to play inside the video player
// export const DEFAULT_VIDEO_STREAM = "https://derste247livede.akamaized.net/hls/live/658317/daserste_de/master_1280p_3628.m3u8";
export const DEFAULT_VIDEO_STREAM = "https://d1n0vkxzlrnwjp.cloudfront.net/f5db4ec5-a009-42a4-aa94-0b61994a035b/AppleHLS1/jendrik_esc_2021.m3u8";
// export const DEFAULT_VIDEO_STREAM = "https://swrbwhls-i.akamaihd.net/hls/live/667638/swrbwd/master-720p-3628.m3u8"
// export const DEFAULT_VIDEO_STREAM = "https://dh63srovlpzwh.cloudfront.net/out/v1/a33612727e4d421499b49e2e6fca31bd/26ffae83adec4ec984e2a35743d98185/b7b01ae410f54fda9dfc5905471986af/index.m3u8";

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;


function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

export const RANDOM = makeid(8);

