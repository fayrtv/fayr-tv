// Framework
import classNames from "classnames";
import { useInjection } from "inversify-react";
import * as React from "react";
import Types from "types/inject";

import useTranslations from "hooks/useTranslations";

import { DeviceInfo } from "components/chime/AudioVideoManager";
import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

// Types
// Components
import { Cell, Flex, Grid, MaterialIcon } from "@fayr/shared-components";

// Styles
import styles from "./MeetingStartScreen.module.scss";

import useMeetingMetaData from "../../../hooks/useMeetingMetaData";
import CamToggle from "../Controls/Buttons/CamToggle";
import { VideoStatus } from "../Controls/Buttons/CamToggleButton";
import MicrophoneToggle from "../Controls/Buttons/MicrophoneToggle";
import { CameraSelection, MicrophoneSelection } from "../Controls/Selection/DeviceSelection";
import AudioSensitivityBar from "./AudioSensitivityBar";

type Props = {
    attendeeId: string | null | undefined;
    onContinue(): void;
};

export const MeetingStartScreen = ({ attendeeId, onContinue }: Props) => {
    const [{ meetingInputOutputDevices }, setMetaData] = useMeetingMetaData();

    const translations = useTranslations();
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    const [currentCam, setCurrentCam] = React.useState<string>(
        () => audioVideoManager.currentVideoInputDevice?.value ?? "",
    );
    const [videoStatus, setVideoStatus] = React.useState(
        audioVideoManager.currentVideoInputDevice == null
            ? VideoStatus.Disabled
            : VideoStatus.Enabled,
    );
    const [camDevices, setCamDevices] = React.useState<Array<DeviceInfo>>([]);

    const [currentMic, setCurrentMic] = React.useState<string>(
        () => audioVideoManager.currentAudioInputDevice?.value ?? "",
    );
    const [audioInputDevices, setAudioInputDevices] = React.useState<Array<DeviceInfo>>([]);

    const [volume, setVolume] = React.useState<number>(0);

    const micEnabled = currentMic !== "";

    const onMicToggleClick = async () => {
        const newMicState = !micEnabled;

        if (newMicState) {
            const devices = await audioVideoManager.listAudioInputDevices();

            // audioVideoManager might return an array of devices here, even if no permission is granted, so we
            // have to check again if the queried devices are proper devices
            if (devices.some((x) => x.deviceId !== "")) {
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));

                await audioVideoManager.setAudioInputDeviceSafe(deviceInfos[0]);
                audioVideoManager.audioVideo.start();
                audioVideoManager.audioVideo.realtimeUnmuteLocalAudio();

                setCurrentMic(deviceInfos[0].label);
                setAudioInputDevices(deviceInfos);
                setMetaData({
                    muted: false,
                    meetingInputOutputDevices: {
                        ...meetingInputOutputDevices,
                        audioInput: deviceInfos[0],
                    },
                });
            }
        } else {
            await audioVideoManager.setAudioInputDeviceSafe(null);
            audioVideoManager.audioVideo.realtimeMuteLocalAudio();
            setAudioInputDevices([]);
            setMetaData({
                muted: true,
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    audioInput: undefined,
                },
            });
            setCurrentMic("");
        }
    };

    const onCamToggleClick = async () => {
        if (videoStatus === VideoStatus.Disabled) {
            setVideoStatus(VideoStatus.Loading);
            const devices = await audioVideoManager.listVideoInputDevices();

            // audioVideoManager might return an array of devices here, even if no permission is granted, so we
            // have to check again if the queried devices are proper devices
            if (devices.some((x) => x.deviceId !== "")) {
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));

                await audioVideoManager.setVideoInputDeviceSafe(deviceInfos[0]);
                audioVideoManager.audioVideo.start();
                audioVideoManager.audioVideo.startLocalVideoTile();

                setVideoStatus(VideoStatus.Enabled);
                setCurrentCam(deviceInfos[0].label);
                setMetaData({
                    meetingInputOutputDevices: {
                        ...meetingInputOutputDevices,
                        cam: deviceInfos[0],
                    },
                    videoEnabled: true,
                });
                setCamDevices(deviceInfos);
            }
        } else {
            setVideoStatus(VideoStatus.Disabled);
            await audioVideoManager.setVideoInputDeviceSafe(null);
            audioVideoManager.audioVideo.stopLocalVideoTile();
            setCamDevices([]);
            setMetaData({
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    cam: undefined,
                },
                videoEnabled: false,
            });
            setCurrentCam("");
        }
    };

    React.useEffect(() => {
        if (videoStatus === VideoStatus.Enabled && videoRef.current) {
            const currentTile = (audioVideoManager.audioVideo as any).videoTileController
                .currentLocalTile.tileState;
            audioVideoManager.audioVideo.bindVideoElement(currentTile.tileId, videoRef.current!);
            audioVideoManager.audioVideo.startLocalVideoTile();
        }
    }, [videoStatus, audioVideoManager.audioVideo]);

    React.useEffect(() => {
        if (micEnabled && audioVideoManager.audioVideo && attendeeId) {
            audioVideoManager.audioVideo.realtimeSubscribeToVolumeIndicator(
                attendeeId,
                (_, volume) => setVolume(volume ?? 0),
            );

            return () =>
                audioVideoManager.audioVideo.realtimeUnsubscribeFromVolumeIndicator(attendeeId);
        }
    }, [micEnabled, audioVideoManager.audioVideo, attendeeId]);

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
                <span>{translations.StartScreenDeviceSelection}</span>
            </Cell>
            <Cell className={styles.CamPreviewCell} gridArea="CamPreview">
                <Flex className={styles.VideoPreviewContainer} direction="Column">
                    <video ref={videoRef} id="TestVideo" autoPlay playsInline />
                    {videoStatus !== VideoStatus.Enabled && (
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
                <AudioSensitivityBar segments={20} volume={volume} />
            </Cell>
            <Cell className={styles.Selection} gridArea="Selection">
                <Flex direction="Column">
                    <Flex direction="Row">
                        <MicrophoneToggle enabled={micEnabled} onClick={onMicToggleClick} />
                        <MicrophoneSelection
                            selectedDevice={currentMic}
                            setSelectedDevice={setCurrentMic}
                            availableDevices={audioInputDevices}
                            audioVideoManager={audioVideoManager}
                        />
                    </Flex>
                    <Flex direction="Row">
                        <CamToggle videoStatus={videoStatus} onClick={onCamToggleClick} />
                        <CameraSelection
                            selectedDevice={currentCam}
                            setSelectedDevice={setCurrentCam}
                            availableDevices={camDevices}
                            audioVideoManager={audioVideoManager}
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
