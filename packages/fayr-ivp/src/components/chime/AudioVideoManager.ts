import {
    AudioVideoFacade,
    BackgroundBlurProcessor,
    BackgroundBlurVideoFrameProcessor,
    DefaultVideoTransformDevice,
    Logger,
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
export class AudioVideoManager implements IAudioVideoManager {
    private _audioVideo!: AudioVideoFacade;
    public set audioVideo(device: AudioVideoFacade) {
        this._audioVideo = device;
    }
    public get audioVideo() {
        return this._audioVideo;
    }

    private _devicesUpdatedCallbacks: Array<DeviceUpdateCallback> = [];

    // Current devices
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

    // Available devices
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

    private readonly _logger: Logger;

    public constructor(
        @inject(Types.LogProvider) logProvider: LogProvider,
        @inject(Types.IChimeEvents) chimeEvents: IChimeEvents,
    ) {
        this._logger = logProvider.logger;
        chimeEvents.roomLeft.register((() => this.resetFields()).bind(this));
    }

    private resetFields() {
        this._audioInputDevices = [];
        this._audioOutputDevices = [];
        this._videoInputDevices = [];
        this._devicesUpdatedCallbacks = [];
    }

    public setNewRoomAudioVideoFacade(audioVideoFacade: AudioVideoFacade) {
        this._audioVideo = audioVideoFacade;
    }

    public async initializeMeetingSession(): Promise<void> {
        this._audioVideo.addDeviceChangeObserver(this);

        // How annoying do you want to be? Javascript "this" scope: Yes
        const that = this;
        await Promise.all([
            this.initDevicesIfAllowed(
                hasMicPermissions,
                function () {
                    return that.listAudioInputDevices();
                },
                this._audioInputDevices,
            ),
            this.initDevicesIfAllowed(
                hasOutputPermissions,
                function () {
                    return that.listAudioOutputDevices();
                },
                this._audioOutputDevices,
            ),
            this.initDevicesIfAllowed(
                hasCamPermissions,
                function () {
                    return that.listVideoInputDevices();
                },
                this._videoInputDevices,
            ),
        ]);

        this.publishDevicesUpdated();
    }

    private initDevicesIfAllowed = async function (
        permissionChecker: () => Promise<boolean>,
        deviceGatherer: () => Promise<Array<MediaDeviceInfo>>,
        field: Array<DeviceInfo>,
    ) {
        if (await permissionChecker()) {
            field = (await deviceGatherer()).map((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }
    };

    // Input picker
    public async chooseAudioInputDevice(device: Nullable<DeviceInfo>) {
        try {
            await this._audioVideo?.chooseAudioInputDevice(device?.value ?? null);
            this._currentAudioInputDevice = device;
        } catch (error: any) {
            this._logger.error(error);
        }
    }

    public async chooseAudioOutputDevice(device: Nullable<DeviceInfo>) {
        try {
            await this._audioVideo?.chooseAudioOutputDevice(device?.value ?? null);
            this._currentAudioOutputDevice = device;
        } catch (error: any) {
            this._logger.error(error);
        }
    }

    public async chooseVideoInputDevice(
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
        } catch (error: any) {
            this._logger.error(error);
        }
    }

    public async changeBlurState(blurBackground: boolean) {
        await this.chooseVideoInputDevice(this._currentVideoInputDevice, blurBackground);
    }

    public async listAudioInputDevices(): Promise<MediaDeviceInfo[]> {
        const inputDevices = await this.listAudioInputDevicesInternal();
        await this.listAudioOutputDevicesInternal();
        return inputDevices;
    }

    public async listAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
        const outputDevices = await this.listAudioOutputDevicesInternal();
        await this.listAudioInputDevicesInternal();
        return outputDevices;
    }

    public async listVideoInputDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await this._audioVideo.listVideoInputDevices();

        if (devices.length) {
            this._videoInputDevices = devices.map<DeviceInfo>((device) => ({
                label: device.label,
                value: device.deviceId,
            }));
        }

        return devices;
    }
    // Observer methods

    audioInputsChanged(freshAudioInputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._audioInputDevices = freshAudioInputDeviceList.map((mediaDeviceInfo) => {
            if (
                this._currentAudioInputDevice &&
                mediaDeviceInfo.deviceId === this._currentAudioInputDevice.value
            ) {
                hasCurrentDevice = true;
            }
            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentAudioInputDevice =
                this._audioInputDevices.length > 0 ? this._audioInputDevices[0] : null;
        }
        this.publishDevicesUpdated();
    }

    audioOutputsChanged(freshAudioOutputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._audioOutputDevices = freshAudioOutputDeviceList.map((mediaDeviceInfo) => {
            if (
                this._currentAudioOutputDevice &&
                mediaDeviceInfo.deviceId === this._currentAudioOutputDevice.value
            ) {
                hasCurrentDevice = true;
            }

            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentAudioOutputDevice =
                this._audioOutputDevices.length > 0 ? this._audioOutputDevices[0] : null;
        }
        this.publishDevicesUpdated();
    }

    videoInputsChanged(freshVideoInputDeviceList: Array<MediaDeviceInfo>) {
        let hasCurrentDevice = false;

        this._videoInputDevices = freshVideoInputDeviceList.map((mediaDeviceInfo) => {
            if (
                this._currentVideoInputDevice &&
                mediaDeviceInfo.deviceId === this._currentVideoInputDevice.value
            ) {
                hasCurrentDevice = true;
            }

            return {
                label: mediaDeviceInfo.label,
                value: mediaDeviceInfo.deviceId,
            };
        });

        if (!hasCurrentDevice) {
            this._currentVideoInputDevice =
                this._videoInputDevices.length > 0 ? this._videoInputDevices[0] : null;
        }

        this.publishDevicesUpdated();
    }

    private async listAudioInputDevicesInternal(): Promise<MediaDeviceInfo[]> {
        const devices = await this._audioVideo.listAudioInputDevices();

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
