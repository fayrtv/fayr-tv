// Framework
import * as React from "react";
import { Nullable } from "types/global";

import { DeviceInfo } from "components/chime/AudioVideoManager";
// Styles
import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

type CommonProps = {
    selectedDevice: Nullable<string>;
    setSelectedDevice(device: string): void;
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
        setSelectedDevice(value);

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
        <select
            title={title}
            name={name}
            className="select__field"
            onChange={handleChange}
            value={selectedDevice ?? undefined}
            disabled={!availableDevices.length}
        >
            {renderDevices(availableDevices, name)}
        </select>
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
                props.audioVideoManager.chooseAudioInputDevice(deviceInfo)).bind(
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
                props.audioVideoManager.chooseAudioOutputDevice(deviceInfo)).bind(
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
                props.audioVideoManager.chooseVideoInputDevice(deviceInfo)).bind(
                props.audioVideoManager,
            )}
        />
    );
};
