export const BASE_HREF = "";

// API endpoint for retrieving the attendees list, joining the room, and ending the room
export const CHIME_ROOM_API = "https://vl8fth0307.execute-api.eu-central-1.amazonaws.com/Prod/";

// Chime-SDK allows up to 16 attendee videos
export const CHIME_ROOM_MAX_ATTENDEE = 16;

// Default video stream to play inside the video player
// export const DEFAULT_VIDEO_STREAM = "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8";
// export const DEFAULT_VIDEO_STREAM = "https://zdf-hls-15.akamaized.net/hls/live/2016498/de/9531e2f112356ae334dd74853c766bd7/4/4.m3u8";
export const DEFAULT_VIDEO_STREAM = "https://d4729bb054b0.eu-west-1.playback.live-video.net/api/video/v1/eu-west-1.015196193568.channel.aggYUgDSxw8e.m3u8";

// Default Chat websocket link
export const CHAT_WEBSOCKET = "wss://fml0rdsl83.execute-api.eu-central-1.amazonaws.com/Prod";

// Chime-SDK logging level: INFO, WARN, ERROR, DEBUG
export const CHIME_LOG_LEVEL = 'DEBUG';

// Chime-Web UI debugging logging: true / false
export const DEBUG = false;


function makeid(length: number) {
	const result = [];
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
}

export const RANDOM = makeid(8);