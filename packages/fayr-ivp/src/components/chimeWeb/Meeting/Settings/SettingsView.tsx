// Framework
import classNames from "classnames";
import { useInjection } from "inversify-react";
import * as React from "react";
import styled from "styled-components";
import Types from "types/inject";

import useMeetingMetaData from "hooks/useMeetingMetaData";
import useTranslations from "hooks/useTranslations";

import { DeviceInfo } from "components/chime/AudioVideoManager";
import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

// Components
import { Cell, Flex, Grid, MaterialIcon, Toggle } from "@fayr/common";

// Styles
import styles from "./SettingsView.module.scss";

import { VideoStatus } from "../../Controls/Buttons/CamToggleButton";
import {
    CameraSelection,
    MicrophoneSelection,
    SpeakerSelection,
} from "../../Controls/Selection/DeviceSelection";
import AudioSensitivityBar from "../AudioSensitivityBar";

const LabelSpan = styled.span`
    margin-right: 10px;
`;

type Props = {
    attendeeId: string | null | undefined;
    onCancel(): void;
    onContinue(): void;
    ref?: React.ForwardedRef<HTMLDivElement>;
};

export const SettingsView = React.forwardRef<HTMLDivElement, Props>(
    ({ attendeeId, onCancel, onContinue }: Props, ref) => {
        const [{ meetingInputOutputDevices, muted }, setMetaData] = useMeetingMetaData();

        const translations = useTranslations();
        const videoRef = React.useRef<HTMLVideoElement>(null);

        const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

        const isCameraEnabled = !!meetingInputOutputDevices?.cam || false;
        const isMicrophoneEnabled = !!meetingInputOutputDevices?.audioInput || false;
        const isAudioOutputEnabled = !!meetingInputOutputDevices?.audioOutput || true;

        const [videoStatus, setVideoStatus] = React.useState(
            meetingInputOutputDevices?.cam == null ? VideoStatus.Disabled : VideoStatus.Enabled,
        );

        const [shouldUseBackgroundBlur, setShouldUseBackgroundBlur] = React.useState(false);
        const [shouldUseNoiseCancellation, setShouldUseNoiseCancellation] = React.useState(false);

        const [volume, setVolume] = React.useState<number>(0);

        const setMicData = (devInfo?: DeviceInfo) => {
            setMetaData({
                muted: !devInfo,
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    audioInput: devInfo,
                },
            });
        };

        const onMicToggleClick = async () => {
            const newMutedState = !muted;
            if (!newMutedState) {
                // Pick the first device
                const devices = await audioVideoManager.listAudioInputDevices();
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));
                await audioVideoManager.setAudioInputDeviceSafe(deviceInfos[0]);

                // Start chime
                audioVideoManager.audioVideo.start();
                audioVideoManager.audioVideo.realtimeUnmuteLocalAudio();

                setMicData(deviceInfos[0]);
            } else {
                // Reset picks & stop chime
                await audioVideoManager.setAudioInputDeviceSafe(null);
                audioVideoManager.audioVideo.realtimeMuteLocalAudio();
                setMicData();
            }
        };

        const setCamData = (devInfo?: DeviceInfo) => {
            setMetaData({
                videoEnabled: !!devInfo,
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    cam: devInfo,
                },
            });
        };

        const onCamToggleClick = async () => {
            if (videoStatus === VideoStatus.Disabled) {
                try {
                    setVideoStatus(VideoStatus.Loading);
                    // Pick the first device
                    const devices = await audioVideoManager.listVideoInputDevices();
                    const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                        label: x.label,
                        value: x.deviceId,
                    }));

                    await audioVideoManager.setVideoInputDeviceSafe(deviceInfos[0]);
                    audioVideoManager.audioVideo.start();
                    audioVideoManager.audioVideo.startLocalVideoTile();

                    setVideoStatus(VideoStatus.Enabled);
                    setCamData(deviceInfos[0]);
                } catch {
                    setVideoStatus(VideoStatus.Disabled);
                }
            } else {
                setVideoStatus(VideoStatus.Disabled);
                await audioVideoManager.setVideoInputDeviceSafe(null);
                audioVideoManager.audioVideo.stopLocalVideoTile();
                setCamData();
            }
        };

        const setSpeakersData = (devInfo?: DeviceInfo) => {
            setMetaData({
                videoEnabled: !!devInfo,
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    audioOutput: devInfo,
                },
            });
        };

        const onSpeakersClick = async () => {
            if (!isAudioOutputEnabled) {
                // Pick the first device
                const devices = await audioVideoManager.listAudioOutputDevices();
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));
                await audioVideoManager.setAudioOutputDeviceSafe(deviceInfos[0]);

                // Start chime
                audioVideoManager.audioVideo.start();
                audioVideoManager.audioVideo.realtimeUnmuteLocalAudio();

                setSpeakersData(deviceInfos[0]);
            } else {
                await audioVideoManager.setAudioOutputDeviceSafe(null);
                setSpeakersData();
            }
        };

        React.useEffect(() => {
            if (videoStatus === VideoStatus.Enabled && videoRef.current) {
                const currentTile = (audioVideoManager.audioVideo as any).videoTileController
                    .currentLocalTile.tileState;
                audioVideoManager.audioVideo.bindVideoElement(
                    currentTile.tileId,
                    videoRef.current!,
                );
                audioVideoManager.audioVideo.startLocalVideoTile();
            }
        }, [videoStatus, audioVideoManager.audioVideo]);

        React.useEffect(() => {
            audioVideoManager.listAudioOutputDevices().then(async (devices) => {
                const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                    label: x.label,
                    value: x.deviceId,
                }));

                await audioVideoManager.setAudioOutputDeviceSafe(deviceInfos[0]);
            });
        }, [audioVideoManager]);

        // Microphone sensitivity indicator
        React.useEffect(() => {
            if (!muted && audioVideoManager.audioVideo && attendeeId) {
                audioVideoManager.audioVideo.realtimeSubscribeToVolumeIndicator(
                    attendeeId,
                    (_, volume) => setVolume(volume ?? 0),
                );

                return () =>
                    audioVideoManager.audioVideo.realtimeUnsubscribeFromVolumeIndicator(attendeeId);
            }
        }, [muted, audioVideoManager.audioVideo, attendeeId]);

        const createToggledSpan = (
            title: string,
            toggleProps: React.ComponentPropsWithRef<typeof Toggle>,
            tooltip?: string,
        ) => (
            <Flex direction="Row" crossAlign="Center" title={tooltip}>
                <LabelSpan>{title}</LabelSpan>
                <Toggle {...toggleProps} />
            </Flex>
        );

        return (
            <div className={styles.Container} ref={ref}>
                <Grid
                    className={styles.SettingsView}
                    gridProperties={{
                        gridTemplateAreas: `
						'Header . . .'
						'Settings Separator CamPreview CamPreview'
						'Settings Separator AudioPreview AudioPreview'
						'Settings Separator ProcessingOptions ProcessingOptions'
						'. . CancelButton SaveButton'
					`,
                        gap: "1rem",
                        gridTemplateColumns: "50% 10% 20% 20%",
                        gridTemplateRows: "10% 40% 15% 20% 15%",
                    }}
                >
                    <Cell className={styles.Header} gridArea="Header">
                        <span>{translations.Settings}</span>
                    </Cell>
                    <Cell gridArea="Settings" className={styles.SettingsSection}>
                        <Flex direction="Column">
                            <Flex className={styles.Item} direction="Column">
                                <Flex direction="Row" space="Between">
                                    <span>Kamera</span>
                                    <Toggle
                                        toggleState={isCameraEnabled}
                                        onToggle={onCamToggleClick}
                                    />
                                </Flex>
                                <div
                                    className={classNames(styles.SelectionDropdown, {
                                        [styles.Hidden]: !isCameraEnabled,
                                    })}
                                >
                                    <CameraSelection
                                        selectedDevice={
                                            meetingInputOutputDevices?.cam?.value ?? null
                                        }
                                        setSelectedDevice={setCamData}
                                        availableDevices={audioVideoManager.videoInputDevices}
                                        audioVideoManager={audioVideoManager}
                                    />
                                </div>
                            </Flex>
                            <Flex className={styles.Item} direction="Column">
                                <Flex direction="Row" space="Between">
                                    <span>Mikrofon</span>
                                    <Toggle
                                        toggleState={isMicrophoneEnabled}
                                        onToggle={onMicToggleClick}
                                    />
                                </Flex>
                                <div
                                    className={classNames(styles.SelectionDropdown, {
                                        [styles.Hidden]: !isMicrophoneEnabled,
                                    })}
                                >
                                    <MicrophoneSelection
                                        selectedDevice={
                                            meetingInputOutputDevices?.audioInput?.value ?? null
                                        }
                                        setSelectedDevice={setMicData}
                                        availableDevices={audioVideoManager.audioInputDevices}
                                        audioVideoManager={audioVideoManager}
                                    />
                                </div>
                            </Flex>
                            <Flex className={styles.Item} direction="Column">
                                <Flex direction="Row" space="Between">
                                    <span>Lautsprecher</span>
                                    <Toggle
                                        toggleState={isAudioOutputEnabled}
                                        onToggle={onSpeakersClick}
                                    />
                                </Flex>
                                <div
                                    className={classNames(styles.SelectionDropdown, {
                                        [styles.Hidden]: !isAudioOutputEnabled,
                                    })}
                                >
                                    <SpeakerSelection
                                        selectedDevice={
                                            meetingInputOutputDevices?.audioOutput?.value ?? null
                                        }
                                        setSelectedDevice={setSpeakersData}
                                        availableDevices={audioVideoManager.audioOutputDevices}
                                        audioVideoManager={audioVideoManager}
                                    />
                                </div>
                            </Flex>
                        </Flex>
                    </Cell>
                    <Cell className={styles.Separator} gridArea="Separator" />
                    <Cell className={styles.CamPreview} gridArea="CamPreview">
                        {videoStatus === VideoStatus.Enabled ? (
                            <video ref={videoRef} id="TestVideo" autoPlay playsInline />
                        ) : (
                            <Flex direction="Column" mainAlign="Center" crossAlign="Center">
                                <span>Noch keine Kamera ausgewählt</span>
                                <MaterialIcon iconName={"videocam_off"} color="white" />
                            </Flex>
                        )}
                    </Cell>
                    <Cell className={styles.AudioPreview} gridArea="AudioPreview">
                        <span className={styles.AudioPreviewContainer}>
                            <AudioSensitivityBar volume={volume} />
                        </span>
                    </Cell>
                    <Cell gridArea="ProcessingOptions">
                        <Flex crossAlign="Center" direction="Column">
                            {createToggledSpan(
                                "Hintergrundunschärfe",
                                {
                                    toggleState: shouldUseBackgroundBlur,
                                    onToggle: async (toggleState: boolean) => {
                                        if (!isCameraEnabled) {
                                            return;
                                        }
                                        setShouldUseBackgroundBlur(toggleState);
                                        await audioVideoManager.setVideoInputDeviceSafe(
                                            audioVideoManager.currentVideoInputDevice,
                                            toggleState,
                                        );
                                    },
                                },
                                isCameraEnabled ? "" : "Keine Kamera ausgewählt",
                            )}
                            {createToggledSpan(
                                "Lärmunterdrückung",
                                {
                                    toggleState: shouldUseNoiseCancellation,
                                    onToggle: async (toggleState: boolean) => {
                                        if (!isMicrophoneEnabled) {
                                            return;
                                        }
                                        setShouldUseNoiseCancellation(toggleState);
                                        await audioVideoManager.setAudioInputDeviceSafe(
                                            audioVideoManager.currentAudioInputDevice,
                                            toggleState,
                                        );
                                    },
                                },
                                isMicrophoneEnabled ? "" : "Kein Mikrofon ausgewählt",
                            )}
                        </Flex>
                    </Cell>
                    <Cell
                        className={classNames(styles.Button, styles.Cancel)}
                        gridArea="CancelButton"
                    >
                        <button
                            className={classNames("btn btn--primary", styles.ContinueButton)}
                            onClick={onCancel}
                        >
                            {translations.Cancel}
                        </button>
                    </Cell>
                    {/* TODO: Figure out how to only commit settings once someone presses Continue, up until then this might be confusing to users */}
                    <Cell className={classNames(styles.Button, styles.Save)} gridArea="SaveButton">
                        <button
                            className={classNames("btn btn--primary", styles.ContinueButton)}
                            onClick={onContinue}
                        >
                            {translations.Save}
                        </button>
                    </Cell>
                </Grid>
            </div>
        );
    },
);

export default SettingsView;
