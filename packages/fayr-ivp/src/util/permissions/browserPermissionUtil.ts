export const hasMicPermissions = () => checkPermissions("audioinput");
export const hasOutputPermissions = () => checkPermissions("audiooutput");
export const hasCamPermissions = () => checkPermissions("videoinput");

const checkPermissions = async (kind: MediaDeviceKind) => {
    // Note: Safari will only allow this API when the server is using https!
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices.some((x) => x.deviceId !== "" && x.kind === kind);
};
