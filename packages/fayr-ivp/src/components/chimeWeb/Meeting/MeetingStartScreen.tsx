// Framework
import { AudioVideoFacade } from "amazon-chime-sdk-js";
import classNames from "classnames";
import * as React from "react";

// Types
import {
    DeviceInfo,
    IChimeAudioVideoProvider,
    IChimeDevicePicker,
} from "components/chime/ChimeSdkWrapper";
import MaterialIcon from "components/common/MaterialIcon";

// Components
import { Grid, Cell, Flex } from "@fayr/shared-components";

// Styles
import styles from "./MeetingStartScreen.module.scss";

import CamToggle from "../Controls/Buttons/CamToggle";
import MicrophoneToggle from "../Controls/Buttons/MicrophoneToggle";
import { CameraSelection, MicrophoneSelection } from "../Controls/Selection/DeviceSelection";
import AudioSensitivityBar from "./AudioSensitivityBar";

type Props = {
    audioVideo: AudioVideoFacade;
    attendeeId: string | null | undefined;
    chime: IChimeDevicePicker & IChimeAudioVideoProvider;
    onContinue(): void;
};

export const MeetingStartScreen = ({ audioVideo, attendeeId, chime, onContinue }: Props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const [currentCam, setCurrentCam] = React.useState<string>(
        () => chime.currentVideoInputDevice?.value ?? "",
    );
    const [camDevices, setCamDevices] = React.useState<Array<DeviceInfo>>([]);

    const [currentMic, setCurrentMic] = React.useState<string>(
        () => chime.currentAudioInputDevice?.value ?? "",
    );
    const [audioInputDevices, setAudioInputDevices] = React.useState<Array<DeviceInfo>>([]);

    const [volume, setVolume] = React.useState<number>(0);

    const camEnabled = currentCam !== "";
    const micEnabled = currentMic !== "";

    const onMicToggleClick = async () => {
        const newMicState = !micEnabled;

        if (newMicState) {
            const devices = await audioVideo.listAudioInputDevices();

            // Chime might return an array of devices here, even if no permission is granted, so we
            // have to check again if the queried devices are proper devices
            if (devices.some((x) => x.deviceId !== "")) {
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));

                await chime.chooseAudioInputDevice(deviceInfos[0]);
                audioVideo.start();
                audioVideo.realtimeUnmuteLocalAudio();

                setCurrentMic(deviceInfos[0].label);
                setAudioInputDevices(deviceInfos);
            }
        } else {
            await chime.chooseAudioInputDevice(null);
            audioVideo.realtimeMuteLocalAudio();
            setAudioInputDevices([]);
            setCurrentMic("");
        }
    };

    const onCamToggleClick = async () => {
        const newCamState = !camEnabled;

        if (newCamState) {
            const devices = await audioVideo.listVideoInputDevices();

            // Chime might return an array of devices here, even if no permission is granted, so we
            // have to check again if the queried devices are proper devices
            if (devices.some((x) => x.deviceId !== "")) {
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));

                await chime.chooseVideoInputDevice(deviceInfos[0]);
                audioVideo.start();

                audioVideo.startLocalVideoTile();

                setCurrentCam(deviceInfos[0].label);
                setCamDevices(deviceInfos);
            }
        } else {
            await chime.chooseVideoInputDevice(null);
            audioVideo.stopLocalVideoTile();
            setCamDevices([]);
            setCurrentCam("");
        }
    };

    React.useEffect(() => {
        if (camEnabled && videoRef.current) {
            const currentTile = (audioVideo as any).videoTileController.currentLocalTile.tileState;
            audioVideo.bindVideoElement(currentTile.tileId, videoRef.current!);
            audioVideo.startLocalVideoTile();
        }
    }, [camEnabled]);

    React.useEffect(() => {
        if (micEnabled && audioVideo && attendeeId) {
            audioVideo.realtimeSubscribeToVolumeIndicator(attendeeId, (_, volume) =>
                setVolume(volume ?? 0),
            );

            return () => audioVideo.realtimeUnsubscribeFromVolumeIndicator(attendeeId);
        }
    }, [micEnabled, audioVideo]);

    // React.useEffect(() => {
    //     const check = async () => {
    //         if (await hasCameraPermission()) {
    //             const devices = await audioVideo.listVideoInputDevices();

    //             const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
    //                 label: x.label,
    //                 value: x.deviceId,
    //             }));
    //             setCamDevices(deviceInfos);
    //             setSelectedCamera(devices[0].deviceId);

    //             window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    //                 if (videoRef.current && stream) {
    //                     videoRef.current.srcObject = stream;
    //                     videoRef.current.onloadedmetadata = (e) => {
    //                         videoRef.current!.play();
    //                     };
    //                 }
    //             });
    //         }
    //     };
    //     check();
    // }, []);

    return (
        <Grid
            className={styles.Container}
            gridProperties={{
                gridTemplateAreas: `
					'Header Header' 
					'CamPreview VolumeSensitivity'
					'CamPreview VolumeSensitivity'
					'Selection ContinueButton'
				`,
                gap: "1rem",
                gridTemplateColumns: "1fr 6rem",
                gridTemplateRows: "3rem 1fr 1fr 11rem",
            }}
        >
            <Cell className={styles.Header} gridArea="Header">
                <span>Geräteauswahl</span>
            </Cell>
            <Cell className={styles.CamPreviewCell} gridArea="CamPreview">
                <Flex className={styles.VideoPreviewContainer} direction="Column">
                    <video ref={videoRef} id="TestVideo" autoPlay playsInline />
                    {!camEnabled && (
                        <div className={styles.NoCamSelected}>
                            <Flex direction="Column" crossAlign="Center">
                                <span>Noch keine Kamera ausgewählt</span>
                                <MaterialIcon iconName={"videocam_off"} color="white" />
                            </Flex>
                        </div>
                    )}
                </Flex>
            </Cell>
            <Cell className={styles.VolumeSensitivity} gridArea="VolumeSensitivity">
                <AudioSensitivityBar segments={10} volume={volume} />
            </Cell>
            <Cell className={styles.Selection} gridArea="Selection">
                <Flex direction="Column">
                    <Flex direction="Row">
                        <MicrophoneToggle toggleState={micEnabled} onClick={onMicToggleClick} />
                        <MicrophoneSelection
                            selectedDevice={currentMic}
                            setSelectedDevice={setCurrentMic}
                            availableDevices={audioInputDevices}
                            chimeDevicePicker={chime}
                        />
                    </Flex>
                    <Flex direction="Row">
                        <CamToggle toggleState={camEnabled} onClick={onCamToggleClick} />
                        <CameraSelection
                            selectedDevice={currentCam}
                            setSelectedDevice={setCurrentCam}
                            availableDevices={camDevices}
                            chimeDevicePicker={chime}
                        />
                    </Flex>
                </Flex>
            </Cell>
            <Cell gridArea="ContinueButton">
                <button
                    className={classNames("btn btn--primary", styles.ContinueButton)}
                    onClick={onContinue}
                >
                    OK
                </button>
            </Cell>
        </Grid>
    );
};

export default MeetingStartScreen;
