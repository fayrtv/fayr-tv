export async function hasCameraPermission() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices.some((x) => x.deviceId !== "" && x.kind === "videoinput");
}
