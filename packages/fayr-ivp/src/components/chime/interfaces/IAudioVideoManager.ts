import { AudioVideoObserver } from "amazon-chime-sdk-js";
import AudioVideoFacade from "amazon-chime-sdk-js/build/audiovideofacade/AudioVideoFacade";
import { Nullable } from "types/global";

import { DeviceInfo, DeviceUpdateCallback } from "../AudioVideoManager";

export default interface IAudioVideoManager {
    audioVideo: AudioVideoFacade;
    currentAudioInputDevice: Nullable<DeviceInfo>;
    currentAudioOutputDevice: Nullable<DeviceInfo>;
    currentVideoInputDevice: Nullable<DeviceInfo>;
    audioInputDevices: Array<DeviceInfo>;
    audioOutputDevices: Array<DeviceInfo>;
    videoInputDevices: Array<DeviceInfo>;

    setAudioInputDeviceSafe(
        device: Nullable<DeviceInfo>,
        addNoiseSuppression?: boolean,
    ): Promise<void>;
    setAudioOutputDeviceSafe(device: Nullable<DeviceInfo>): Promise<void>;
    setVideoInputDeviceSafe(device: Nullable<DeviceInfo>, blurBackground?: boolean): Promise<void>;
    changeBlurState(blurBackground: boolean): Promise<void>;

    initializeMeetingSession(): Promise<void>;
    subscribeToDevicesUpdated(callback: DeviceUpdateCallback): void;
    unsubscribeFromDevicesUpdated(callback: DeviceUpdateCallback): void;

    listAudioInputDevices(): Promise<MediaDeviceInfo[]>;
    listAudioOutputDevices(): Promise<MediaDeviceInfo[]>;
    listVideoInputDevices(): Promise<MediaDeviceInfo[]>;

    tryRemoveObserver(observer: AudioVideoObserver): void;
}
