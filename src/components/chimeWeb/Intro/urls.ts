export function formatJoinRoomUrl(roomCode: string) {
    const baseUrl = document.baseURI.replace("/chime-web", "");
    return `${baseUrl}/meeting?action=join&room=${roomCode}`;
}
