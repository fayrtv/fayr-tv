export const hasMicPermissions = () => checkPermissions("audioinput");
export const hasOutputPermissions = () => checkPermissions("audiooutput");
export const hasCamPermissions = () => checkPermissions("videoinput");

const checkPermissions = async (kind: MediaDeviceKind) => {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return devices.some((x) => x.deviceId !== "" && x.kind === kind);
};
