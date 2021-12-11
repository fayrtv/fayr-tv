export function formatJoinRoomUrl(roomTitle: string) {
    const baseUrl = document.baseURI.replace("/chime-web", "");
    return `${baseUrl}/meeting?action=join&room=${roomTitle}`;
}
