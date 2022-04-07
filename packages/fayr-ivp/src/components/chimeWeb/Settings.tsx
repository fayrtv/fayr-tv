import { useInjection } from "inversify-react";
import * as React from "react";
import { Nullable } from "types/global";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";

import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

import { MaterialIcon } from "@fayr/shared-components";

import styles from "./Settings.module.scss";

import * as config from "../../config";
import Types from "../../types/inject";
import {
    MicrophoneSelection,
    CameraSelection,
    SpeakerSelection,
} from "./Controls/Selection/DeviceSelection";
import { JoinInfo } from "./types";

type Props = {
    joinInfo: JoinInfo;
    saveSettings(
        playbackURL: string,
        microphone: Nullable<string>,
        speaker: Nullable<string>,
        camera: Nullable<string>,
    ): void;
    closeSettings(): void;
};

export const Settings = ({ closeSettings, joinInfo, saveSettings }: Props) => {
    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    const availableMics = audioVideoManager.audioInputDevices;
    const availableSpeakers = audioVideoManager.audioOutputDevices;
    const availableCams = audioVideoManager.videoInputDevices;

    const [microphone, setMicrophone] = React.useState<Nullable<string>>(
        audioVideoManager.currentAudioInputDevice?.value ?? null,
    );
    const [speaker, setSpeaker] = React.useState<Nullable<string>>(
        audioVideoManager.currentAudioOutputDevice?.value ?? null,
    );
    const [camera, setCamera] = React.useState<Nullable<string>>(
        audioVideoManager.currentVideoInputDevice?.value ?? null,
    );

    useGlobalKeyHandler("Escape", closeSettings);

    const devicesUpdatedCallback = (fullDeviceInfo: any) => {
        if (config.DEBUG) {
            console.log(fullDeviceInfo);
        }
    };

    React.useEffect(() => {
        audioVideoManager.subscribeToDevicesUpdated(devicesUpdatedCallback);
        return () => audioVideoManager.unsubscribeFromDevicesUpdated(devicesUpdatedCallback);
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
                            audioVideoManager={audioVideoManager}
                        />
                        <h2 className="mg-b-2">Lautsprecher</h2>
                        <SpeakerSelection
                            selectedDevice={speaker}
                            setSelectedDevice={setSpeaker}
                            availableDevices={availableSpeakers}
                            audioVideoManager={audioVideoManager}
                        />
                        <h2 className="mg-b-2">Kamera</h2>
                        <CameraSelection
                            selectedDevice={camera}
                            setSelectedDevice={setCamera}
                            availableDevices={availableCams}
                            audioVideoManager={audioVideoManager}
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
