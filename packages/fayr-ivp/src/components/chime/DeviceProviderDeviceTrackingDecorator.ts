import {
    DeviceInfo,
    IDeviceProvider,
    IChimeAudioVideoProvider,
    IChimeSdkWrapper,
} from "./ChimeSdkWrapper";

export default class DeviceProviderDeviceTrackingDecorator implements IDeviceProvider {
    private _chime: IChimeAudioVideoProvider & IChimeSdkWrapper;

    constructor(chime: IChimeAudioVideoProvider & IChimeSdkWrapper) {
        this._chime = chime;
    }

    public async listAudioInputDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await this._chime.audioVideo.listAudioInputDevices();

        if (devices.length) {
            this._chime.audioInputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }

    public async listVideoInputDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await this._chime.audioVideo.listVideoInputDevices();

        if (devices.length) {
            this._chime.videoInputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }

    public async listAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await this._chime.audioVideo.listAudioOutputDevices();

        if (devices.length) {
            this._chime.audioOutputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }
}
