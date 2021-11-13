// Framework
import * as React from "react";

// Functionality
import useEventHandler from "hooks/useEventHandler";
import * as config from "../../config";

// Types
import { JoinInfo } from "./types";

// Styles
import styles from "./Settings.module.scss";

type Props = {
    chime: any;
    joinInfo: JoinInfo;
    saveSettings(playbackUrl: string, microphone: string, speaker: string, camera: string): void;
    closeSettings(): void;
};

export const Settings = ({ chime, closeSettings, joinInfo, saveSettings }: Props) => {
    const currentMic = chime.currentAudioInputDevice;
    const currentSpeaker = chime.currentAudioOutputDevice;
    const currentCam = chime.currentVideoInputDevice;
    const availableMics = chime.audioInputDevices;
    const availableSpeakers = chime.audioOutputDevices;
    const availableCams = chime.videoInputDevices;

    const playbackUrl = joinInfo.PlaybackURL;
    // const [playbackUrl, setPlaybackUrl] = React.useState<string>(joinInfo.PlaybackURL);

    const [microphone, setMicrophone] = React.useState<string>(currentMic?.value);
    const [speaker, setSpeaker] = React.useState<string>(currentSpeaker?.value);
    const [camera, setCamera] = React.useState<string>(currentCam?.value);

    const handleKeyDown = React.useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === "Escape") {
                // keyCode 27 is Escape key
                closeSettings();
            }
        },
        [closeSettings],
    );

    useEventHandler("keydown", handleKeyDown);

    const devicesUpdatedCallback = (fullDeviceInfo: any) => {
        if (config.DEBUG) {
            console.log(fullDeviceInfo);
        }
    };

    React.useEffect(() => {
        chime.subscribeToDevicesUpdated(devicesUpdatedCallback);
        return () => chime.unsubscribeFromDevicesUpdated(devicesUpdatedCallback);
    });

    // const handlePlaybackURLChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setPlaybackUrl(e.target.value);

    const handleMicrophoneChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = e.target.value;
        setMicrophone(value);

        if (chime.audioInputDevices.length) {
            for (let o in chime.audioInputDevices) {
                if (chime.audioInputDevices[o].value === value) {
                    chime.chooseAudioInputDevice(chime.audioInputDevices[o]);
                    break;
                }
            }
        }
    };

    const handleSpeakerChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = e.target.value;
        setSpeaker(value);

        if (chime.audioOutputDevices.length) {
            for (let o in chime.audioOutputDevices) {
                if (chime.audioOutputDevices[o].value === value) {
                    chime.chooseAudioOutputDevice(chime.audioOutputDevices[o]);
                    break;
                }
            }
        }
    };

    const handleCameraChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = e.target.value;
        setCamera(value);

        if (chime.videoInputDevices.length) {
            for (let o in chime.videoInputDevices) {
                if (chime.videoInputDevices[o].value === value) {
                    chime.chooseVideoInputDevice(chime.videoInputDevices[o]);
                    break;
                }
            }
        }
    };

    const handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        e.preventDefault();

        saveSettings(playbackUrl, microphone, speaker, camera);
    };

    const renderDevices = (devices: any[], label: string) => {
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
        <div className="modal pos-absolute top-0 bottom-0">
            <div className={`${styles.SettingsContainer} modal__el`}>
                <h1 className="mg-b-2">Einstellungen</h1>
                <form>
                    <fieldset>
                        {/* <input
							className="mg-b-2"
							name=""
							id=""
							type="text"
							readOnly={true}
							placeholder="Playback URL"
							onChange={handlePlaybackURLChange}
							value={playbackUrl}
							disabled /> */}
                        <h2 className="mg-b-2">Mikrofon</h2>
                        <select
                            title="Mikrofon"
                            name="microphone"
                            className="select__field"
                            onChange={handleMicrophoneChange}
                            value={microphone}
                            disabled={!availableMics.length}
                        >
                            {renderDevices(availableMics, "microphone")}
                        </select>
                        <h2 className="mg-b-2">Lautsprecher</h2>
                        <select
                            title="Lautsprecher"
                            name="speaker"
                            className="select__field"
                            onChange={handleSpeakerChange}
                            value={speaker}
                            disabled={!availableSpeakers.length}
                        >
                            {renderDevices(availableSpeakers, "speaker")}
                        </select>
                        <h2 className="mg-b-2">Kamera</h2>
                        <select
                            title="Kamera"
                            name="camera"
                            className="select__field"
                            onChange={handleCameraChange}
                            value={camera}
                            disabled={!availableCams.length}
                        >
                            {renderDevices(availableCams, "camera")}
                        </select>
                        <button className="btn btn--primary mg-t-2" onClick={handleSave}>
                            Speichern
                        </button>
                    </fieldset>
                </form>
            </div>
            <div className="modal__overlay" onClick={closeSettings}></div>
        </div>
    );
};

export default Settings;
