// Framework
import * as React from "react";

// Styles
import { DeviceInfo, IChimeDevicePicker } from "components/chime/ChimeSdkWrapper";

type CommonProps = {
    selectedDevice: string;
    setSelectedDevice(device: string): void;
    chimeUpdateCb(device: DeviceInfo): void;
    availableDevices: Array<DeviceInfo>;
    name: string;
    title: string;
};

const DeviceSelection = ({
    selectedDevice,
    setSelectedDevice,
    chimeUpdateCb,
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
                    chimeUpdateCb(availableDevices[o]);
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
            value={selectedDevice}
            disabled={!availableDevices.length}
        >
            {renderDevices(availableDevices, name)}
        </select>
    );
};

type SpecializedProps = Omit<
    CommonProps & { chimeDevicePicker: IChimeDevicePicker },
    "title" | "microphone" | "chimeUpdateCb" | "name"
>;

export const MicrophoneSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Mikrofon"
            name="microphone"
            chimeUpdateCb={props.chimeDevicePicker.chooseAudioInputDevice}
        />
    );
};

export const SpeakerSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Lautsprecher"
            name="speaker"
            chimeUpdateCb={props.chimeDevicePicker.chooseAudioOutputDevice}
        />
    );
};

export const CameraSelection = (props: SpecializedProps) => {
    return (
        <DeviceSelection
            {...props}
            title="Kamera"
            name="camera"
            chimeUpdateCb={props.chimeDevicePicker.chooseVideoInputDevice}
        />
    );
};
