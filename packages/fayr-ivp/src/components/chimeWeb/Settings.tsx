import * as React from "react";
import { Nullable } from "types/global";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";

import { IAudioVideoManager } from "components/chime/AudioVideoManager";
import { IChimeSdkWrapper } from "components/chime/ChimeSdkWrapper";

import { MaterialIcon } from "@fayr/shared-components";

import styles from "./Settings.module.scss";

import * as config from "../../config";
import { IChimeAudioVideoProvider } from "../chime/ChimeSdkWrapper";
import {
    MicrophoneSelection,
    CameraSelection,
    SpeakerSelection,
} from "./Controls/Selection/DeviceSelection";
import { JoinInfo } from "./types";

type Props = {
    chime: IAudioVideoManager & IChimeAudioVideoProvider & IChimeSdkWrapper;
    joinInfo: JoinInfo;
    saveSettings(
        playbackUrl: string,
        microphone: Nullable<string>,
        speaker: Nullable<string>,
        camera: Nullable<string>,
    ): void;
    closeSettings(): void;
};

export const Settings = ({ chime, closeSettings, joinInfo, saveSettings }: Props) => {
    const availableMics = chime.audioInputDevices;
    const availableSpeakers = chime.audioOutputDevices;
    const availableCams = chime.videoInputDevices;

    const [microphone, setMicrophone] = React.useState<Nullable<string>>(
        chime.currentAudioInputDevice?.value ?? null,
    );
    const [speaker, setSpeaker] = React.useState<Nullable<string>>(
        chime.currentAudioOutputDevice?.value ?? null,
    );
    const [camera, setCamera] = React.useState<Nullable<string>>(
        chime.currentVideoInputDevice?.value ?? null,
    );

    useGlobalKeyHandler("Escape", closeSettings);

    const devicesUpdatedCallback = (fullDeviceInfo: any) => {
        if (config.DEBUG) {
            console.log(fullDeviceInfo);
        }
    };

    React.useEffect(() => {
        chime.subscribeToDevicesUpdated(devicesUpdatedCallback);
        return () => chime.unsubscribeFromDevicesUpdated(devicesUpdatedCallback);
    });

    const handleSave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        e.preventDefault();

        saveSettings(joinInfo.PlaybackURL, microphone, speaker, camera);
    };

    return (
        <div className="modal pos-absolute top-0 bottom-0">
            <div className={`${styles.SettingsContainer} modal__el`}>
                <h1 className="mg-b-2">Einstellungen</h1>
                <form>
                    <fieldset>
                        <h2 className="mg-b-2">Mikrofon</h2>
                        <MicrophoneSelection
                            selectedDevice={microphone}
                            setSelectedDevice={setMicrophone}
                            availableDevices={availableMics}
                            chimeDevicePicker={chime}
                        />
                        <h2 className="mg-b-2">Lautsprecher</h2>
                        <SpeakerSelection
                            selectedDevice={speaker}
                            setSelectedDevice={setSpeaker}
                            availableDevices={availableSpeakers}
                            chimeDevicePicker={chime}
                        />
                        <h2 className="mg-b-2">Kamera</h2>
                        <CameraSelection
                            selectedDevice={camera}
                            setSelectedDevice={setCamera}
                            availableDevices={availableCams}
                            chimeDevicePicker={chime}
                        />
                        <button className="btn btn--primary mg-t-2" onClick={handleSave}>
                            Speichern
                        </button>
                    </fieldset>
                </form>
                <MaterialIcon
                    className={styles.CloseButton}
                    onClick={closeSettings}
                    iconName="close"
                    color="white"
                    size={35}
                />
            </div>
            <div className="modal__overlay" onClick={closeSettings} />
        </div>
    );
};

export default Settings;
