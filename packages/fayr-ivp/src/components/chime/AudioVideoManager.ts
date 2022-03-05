import { AudioVideoFacade, BackgroundBlurProcessor, BackgroundBlurVideoFrameProcessor, DefaultVideoTransformDevice, Logger } from "amazon-chime-sdk-js";
import { Nullable } from "types/global";

import { DeviceInfo } from "./ChimeSdkWrapper";

export interface IAudioVideoManager {
	get audioVideo(): Nullable<AudioVideoFacade>;
	set audioVideo(device: Nullable<AudioVideoFacade>);
	get currentAudioInputDevice(): Nullable<DeviceInfo>;
	set currentAudioInputDevice(device: Nullable<DeviceInfo>);
	get currentAudioOutputDevice(): Nullable<DeviceInfo>
	set currentAudioOutputDevice(device: Nullable<DeviceInfo>);
	get currentVideoInputDevice(): Nullable<DeviceInfo>;
	set currentVideoInputDevice(device: Nullable<DeviceInfo>);
	

    chooseAudioInputDevice(device: Nullable<DeviceInfo>): Promise<void>;
    chooseAudioOutputDevice(device: Nullable<DeviceInfo>): Promise<void>;
    chooseVideoInputDevice(device: Nullable<DeviceInfo>, blurBackground?: boolean): Promise<void>;
	changeBlurState(blurBackground: boolean): Promise<void>;
}

export class AudioVideoManager implements IAudioVideoManager {
    private _audioVideo: Nullable<AudioVideoFacade> = null;
	public set audioVideo(device: Nullable<AudioVideoFacade>) {
		this._audioVideo = device;
	}
	public get audioVideo() {
		return this._audioVideo;
	}

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

    private readonly _logger: Logger;

    constructor(logger: Logger) {
        this._logger = logger;
    }

    chooseAudioInputDevice = async (device: Nullable<DeviceInfo>) => {
        try {
            await this._audioVideo?.chooseAudioInputDevice(device?.value ?? null);
            this._currentAudioInputDevice = device;
        } catch (error: any) {
            this._logger.error(error);
        }
    };

    chooseAudioOutputDevice = async (device: Nullable<DeviceInfo>) => {
        try {
            await this._audioVideo?.chooseAudioOutputDevice(device?.value ?? null);
            this._currentAudioOutputDevice = device;
        } catch (error: any) {
            this._logger.error(error);
        }
    };

    chooseVideoInputDevice = async (device: Nullable<DeviceInfo>, blurBackground: boolean = false) => {
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
    };

	changeBlurState = async (blurBackground: boolean) => {
		await this.chooseVideoInputDevice(this._currentVideoInputDevice, blurBackground);
	}
}
