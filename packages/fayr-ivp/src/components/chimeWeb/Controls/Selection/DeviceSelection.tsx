// Framework
import * as React from "react";
import { Nullable } from "types/global";

import { DeviceInfo } from "components/chime/AudioVideoManager";
// Styles
import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

import { MaterialIcon } from "@fayr/common";

import styles from "./DeviceSelection.module.scss";

type CommonProps = {
    selectedDevice: Nullable<string>;
    setSelectedDevice(device: DeviceInfo): void;
    onUpdate(device: DeviceInfo): void;
    availableDevices: Array<DeviceInfo>;
    name: string;
    title: string;
};

const DeviceSelection = ({
    selectedDevice,
    setSelectedDevice,
    onUpdate,
    availableDevices,
    name,
    title,
}: CommonProps) => {
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = e.target.value;
        setSelectedDevice(availableDevices.find((x) => x.value === value)!);

        if (availableDevices.length) {
            for (let o in availableDevices) {
                if (availableDevices[o].value === value) {
                    onUpdate(availableDevices[o]);
                    break;
                }
            }
        }
    };

    const renderDevices = (devices: Array<DeviceInfo>, label: string) => {
        if (devices && devices.length) {
            return devices.map((device) => (
                <option key={device.value} value={device.value}>
                    {`${device.label}`}
                </option>
            ));
        } else {
            return (
                <option value="no-permission">
                    {`Permission not granted to access ${label} devices`}
                </option>
            );
        }
    };

    return (
        <div className={styles.Container}>
            <select
                title={title}
                name={name}
                className={styles.Selection}
                onChange={handleChange}
                value={selectedDevice ?? undefined}
                disabled={!availableDevices.length}
            >
                {renderDevices(availableDevices, name)}
            </select>
            <MaterialIcon
                className={styles.DropdownIndicator}
                color="white"
                iconName="expand_more"
                size={24}
            />
        </div>
    );
};

type SpecializedProps = Omit<
    CommonProps & { audioVideoManager: IAudioVideoManager },
    "title" | "microphone" | "onUpdate" | "name"
>;

export const MicrophoneSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Mikrofon"
            name="microphone"
            onUpdate={((deviceInfo: DeviceInfo) =>
                // eslint-disable-next-line no-extra-bind
                props.audioVideoManager.setAudioInputDeviceSafe(deviceInfo)).bind(
                props.audioVideoManager,
            )}
        />
    );
};

export const SpeakerSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Lautsprecher"
            name="speaker"
            onUpdate={((deviceInfo: DeviceInfo) =>
                // eslint-disable-next-line no-extra-bind
                props.audioVideoManager.setAudioOutputDeviceSafe(deviceInfo)).bind(
                props.audioVideoManager,
            )}
        />
    );
};

export const CameraSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Kamera"
            name="camera"
            onUpdate={((deviceInfo: DeviceInfo) =>
                // eslint-disable-next-line no-extra-bind
                props.audioVideoManager.setVideoInputDeviceSafe(deviceInfo)).bind(
                props.audioVideoManager,
            )}
        />
    );
};
