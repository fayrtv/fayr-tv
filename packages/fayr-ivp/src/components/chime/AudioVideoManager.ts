import {
    AudioVideoFacade,
    AudioVideoObserver,
    BackgroundBlurProcessor,
    BackgroundBlurVideoFrameProcessor,
    DefaultVideoTransformDevice,
    DeviceChangeObserver,
    Logger,
    VoiceFocusDeviceTransformer,
    VoiceFocusTransformDevice,
} from "amazon-chime-sdk-js";
import { inject, injectable } from "inversify";
import { Nullable } from "types/global";
import Types from "types/inject";
import {
    hasCamPermissions,
    hasMicPermissions,
    hasOutputPermissions,
} from "util/permissions/browserPermissionUtil";

import LogProvider from "./LogProvider";
import IAudioVideoManager from "./interfaces/IAudioVideoManager";
import IChimeEvents from "./interfaces/IChimeEvents";

export type DeviceInfo = {
    label: string;
    value: string;
};

type DeviceUpdatePayload = {
    currentAudioInputDevice: Nullable<DeviceInfo>;
    currentAudioOutputDevice: Nullable<DeviceInfo>;
    currentVideoInputDevice: Nullable<DeviceInfo>;
    audioInputDevices: Array<DeviceInfo>;
    audioOutputDevices: Array<DeviceInfo>;
    videoInputDevices: Array<DeviceInfo>;
};

export type DeviceUpdateCallback = (deviceInfo: DeviceUpdatePayload) => void;

@injectable()
export class AudioVideoManager implements IAudioVideoManager, DeviceChangeObserver {
    private _audioVideo!: AudioVideoFacade;
    public set audioVideo(device: AudioVideoFacade) {
        this._audioVideo = device;
    }
    public get audioVideo() {
        return this._audioVideo;
    }

    private _devicesUpdatedCallbacks: Array<DeviceUpdateCallback> = [];

    // #region Current devices
    private _currentAudioInputDevice: Nullable<DeviceInfo> = null;
    public get currentAudioInputDevice() {
        return this._currentAudioInputDevice;
    }
    public set currentAudioInputDevice(device: Nullable<DeviceInfo>) {
        this._currentAudioInputDevice = device;
    }

    private _currentAudioOutputDevice: Nullable<DeviceInfo> = null;
    public get currentAudioOutputDevice() {
        return this._currentAudioOutputDevice;
    }
    public set currentAudioOutputDevice(device: Nullable<DeviceInfo>) {
        this._currentAudioOutputDevice = device;
    }

    private _currentVideoInputDevice: Nullable<DeviceInfo> = null;
    public get currentVideoInputDevice() {
        return this._currentVideoInputDevice;
    }
    public set currentVideoInputDevice(device: Nullable<DeviceInfo>) {
        this._currentVideoInputDevice = device;
    }
    // #endregion

    // #region Available devices
    private _audioInputDevices: Array<DeviceInfo> = [];
    public get audioInputDevices() {
        return this._audioInputDevices;
    }
    public set audioInputDevices(devices: Array<DeviceInfo>) {
        this._audioInputDevices = devices;
        this.publishDevicesUpdated();
    }
    private _audioOutputDevices: Array<DeviceInfo> = [];
    public get audioOutputDevices() {
        return this._audioOutputDevices;
    }
    public set audioOutputDevices(devices: Array<DeviceInfo>) {
        this._audioOutputDevices = devices;
        this.publishDevicesUpdated();
    }
    private _videoInputDevices: Array<DeviceInfo> = [];
    public get videoInputDevices() {
        return this._videoInputDevices;
    }
    public set videoInputDevices(devices: Array<DeviceInfo>) {
        this._videoInputDevices = devices;
        this.publishDevicesUpdated();
    }
    //#endregion

    private readonly _logger: Logger;

    public constructor(
        @inject(Types.LogProvider) logProvider: LogProvider,
        @inject(Types.IChimeEvents) chimeEvents: IChimeEvents,
    ) {
        this._logger = logProvider.logger;

        chimeEvents.roomLeft.register(this.resetFields);
    }

    private resetFields = () => {
        this._audioInputDevices = [];
        this._audioOutputDevices = [];
        this._videoInputDevices = [];
        this._devicesUpdatedCallbacks = [];
    };

    public setNewRoomAudioVideoFacade(audioVideoFacade: AudioVideoFacade) {
        this._audioVideo = audioVideoFacade;
    }

    public async initializeMeetingSession(): Promise<void> {
        this._audioVideo.addDeviceChangeObserver(this);

        // How annoying do you want to be? Javascript "this" scope: Yes
        await Promise.all([
            this.initDevicesIfAllowed(hasMicPermissions, this.listAudioInputDevices),
            this.initDevicesIfAllowed(hasOutputPermissions, this.listAudioOutputDevices),
            this.initDevicesIfAllowed(hasCamPermissions, this.listVideoInputDevices),
        ]);

        this.publishDevicesUpdated();
    }

    private initDevicesIfAllowed = async function(
        permissionChecker: () => Promise<boolean>,
        deviceGatherer: () => Promise<Array<MediaDeviceInfo>>,
    ) {
        if (await permissionChecker()) {
            (await deviceGatherer()).map((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }
    };

    // Input picker
    public setAudioInputDeviceSafe = async (
        device: Nullable<DeviceInfo>,
        addNoiseSuppression: boolean = false,
    ) => {
        try {
            let actualDevice: Nullable<string> | VoiceFocusTransformDevice = device?.value ?? null;

            if (addNoiseSuppression && (await VoiceFocusDeviceTransformer.isSupported())) {
                const transformer = await VoiceFocusDeviceTransformer.create();

                // Checks if the transformation spec is supported. The transformer itself might
                // be supported, but maybe the transformation spec is not
                if (await transformer.isSupported()) {
                    const transformDevice = await transformer.createTransformDevice(actualDevice);

                    if (transformDevice) {
                        actualDevice = transformDevice;
                    }
                }
            }

            await this._audioVideo?.chooseAudioInputDevice(actualDevice);
            this._currentAudioInputDevice = device;
        } catch (error) {
            this._logger.error(error);
        }
    };

    public setAudioOutputDeviceSafe = async (device: Nullable<DeviceInfo>) => {
        this.currentAudioOutputDevice = await this.setDeviceSafe(
            device,
            async (deviceId: string | null) => {
                await this._audioVideo?.chooseAudioOutputDevice(deviceId);
            },
        );
    };

    public async setVideoInputDeviceSafe(
        device: Nullable<DeviceInfo>,
        blurBackground: boolean = false,
    ) {
        try {
            if (!device?.value) {
                return;
            }

            let actualDevice: string | DefaultVideoTransformDevice = device.value;
            if (blurBackground) {
                // Background Blur
                const processors: Array<BackgroundBlurProcessor> = [];

                if (await BackgroundBlurVideoFrameProcessor.isSupported()) {
                    const blurProcessor = await BackgroundBlurVideoFrameProcessor.create();

                    if (blurProcessor) {
                        processors.push(blurProcessor);
                    }
                }
                actualDevice = new DefaultVideoTransformDevice(
                    this._logger,
                    device?.value ?? null,
                    processors,
                );
            }

            await this._audioVideo?.chooseVideoInputDevice(actualDevice);
            this._currentVideoInputDevice = device;
        } catch (error) {
            this._logger.error(error);
        }
    }

    private setDeviceSafe = async (
        device: Nullable<DeviceInfo>,
        chooser: (deviceId: string | null) => Promise<void>,
    ): Promise<Nullable<DeviceInfo>> => {
        try {
            await chooser(device?.value ?? null);
            return device;
        } catch (error) {
            this._logger.error(error);
            return null;
        }
    };

    public changeBlurState = (blurBackground: boolean) =>
        this.setVideoInputDeviceSafe(this._currentVideoInputDevice, blurBackground);

    public listAudioInputDevices = async (): Promise<MediaDeviceInfo[]> => {
        const inputDevices = await this.listAudioInputDevicesInternal();
        await this.listAudioOutputDevicesInternal();
        return inputDevices;
    };

    public listAudioOutputDevices = async (): Promise<MediaDeviceInfo[]> => {
        // We can query these 2 in pair since they share permissions
        const outputDevices = await this.listAudioOutputDevicesInternal();
        await this.listAudioInputDevicesInternal();
        return outputDevices;
    };

    public tryRemoveObserver = (observer: AudioVideoObserver) => {
        try {
            this.audioVideo.removeObserver(observer);
        } catch (ex) {
            // ok
        }
    };

    // #region Observer methods
    audioInputsChanged = (freshAudioInputDeviceList: Array<MediaDeviceInfo>) =>
        this.onDevicesChanged(
            freshAudioInputDeviceList,
            (coll) => (this._audioInputDevices = coll),
            this._audioInputDevices,
            (device) => (this._currentAudioInputDevice = device),
            this._currentAudioInputDevice,
        );

    audioOutputsChanged = (freshAudioOutputDeviceList: Array<MediaDeviceInfo>) =>
        this.onDevicesChanged(
            freshAudioOutputDeviceList,
            (coll) => (this._audioOutputDevices = coll),
            this._audioOutputDevices,
            (device) => (this._currentAudioOutputDevice = device),
            this._currentAudioOutputDevice,
        );

    videoInputsChanged = (freshVideoInputDeviceList: Array<MediaDeviceInfo>) =>
        this.onDevicesChanged(
            freshVideoInputDeviceList,
            (coll) => (this._videoInputDevices = coll),
            this._videoInputDevices,
            (device) => (this._currentVideoInputDevice = device),
            this._currentVideoInputDevice,
        );

    private onDevicesChanged = (
        deviceList: Array<MediaDeviceInfo>,
        collectionSetter: (deviceInfos: Array<DeviceInfo>) => void,
        collection: Array<DeviceInfo>,
        currentDeviceSetter: (deviceInfo: Nullable<DeviceInfo>) => void,
        currentDevice: Nullable<DeviceInfo>,
    ) => {
        let hasCurrentDevice = false;

        if (currentDevice && deviceList.some((x) => x.deviceId === currentDevice.value)) {
            collectionSetter(
                deviceList.map((mediaDeviceInfo) => ({
                    label: mediaDeviceInfo.label,
                    value: mediaDeviceInfo.deviceId,
                })),
            );
        }

        if (!hasCurrentDevice) {
            currentDeviceSetter(collection.length > 0 ? collection[0] : null);
        }

        this.publishDevicesUpdated();
    };

    // #endregion

    public listVideoInputDevices = async (): Promise<MediaDeviceInfo[]> => {
        const devices = await this._audioVideo.listVideoInputDevices();

        // Might return an array of devices here, even if no permission is granted, so we
        // have to check again if the queried devices are proper devices
        if (!devices.some((x) => x.deviceId !== "")) {
            return [];
        }

        if (devices.length) {
            this._videoInputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    };

    private async listAudioInputDevicesInternal(): Promise<MediaDeviceInfo[]> {
        const devices = await this._audioVideo.listAudioInputDevices();

        // Might return an array of devices here, even if no permission is granted, so we
        // have to check again if the queried devices are proper devices
        if (!devices.some((x) => x.deviceId !== "")) {
            return [];
        }

        if (devices.length) {
            this._audioInputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }

    private async listAudioOutputDevicesInternal(): Promise<MediaDeviceInfo[]> {
        const devices = await this._audioVideo.listAudioOutputDevices();

        // Might return an array of devices here, even if no permission is granted, so we
        // have to check again if the queried devices are proper devices
        if (!devices.some((x) => x.deviceId !== "")) {
            return [];
        }

        if (devices.length) {
            this._audioOutputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }

    private publishDevicesUpdated() {
        const params: DeviceUpdatePayload = {
            currentAudioInputDevice: this._currentAudioInputDevice,
            currentAudioOutputDevice: this._currentAudioOutputDevice,
            currentVideoInputDevice: this._currentVideoInputDevice,
            audioInputDevices: this._audioInputDevices,
            audioOutputDevices: this._audioOutputDevices,
            videoInputDevices: this._videoInputDevices,
        };

        this._devicesUpdatedCallbacks.forEach((cb) => cb(params));
    }

    public subscribeToDevicesUpdated(callback: DeviceUpdateCallback) {
        this._devicesUpdatedCallbacks.push(callback);
    }

    public unsubscribeFromDevicesUpdated(callback: DeviceUpdateCallback) {
        const index = this._devicesUpdatedCallbacks.indexOf(callback);
        if (index !== -1) {
            this._devicesUpdatedCallbacks.splice(index, 1);
        }
    }
}
