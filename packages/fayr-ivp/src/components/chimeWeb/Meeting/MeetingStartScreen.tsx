// Framework
import { AudioVideoFacade } from "amazon-chime-sdk-js";
import * as React from "react";

// Types
import { DeviceInfo } from "components/chime/ChimeSdkWrapper";

// Components
import { Grid, Cell, Flex } from "@fayr/shared-components";

// Styles
import styles from "./MeetingStartScreen.module.scss";

import CamToggle from "../Controls/Buttons/CamToggle";
import MicrophoneToggle from "../Controls/Buttons/MicrophoneToggle";

type Props = {
    audioVideo: AudioVideoFacade;
    onContinue(): void;
};

export const MeetingStartScreen = ({ audioVideo, onContinue }: Props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const [micMuted, setMicMuted] = React.useState(true);
    const [camEnabled, setCamEnabled] = React.useState(false);
    const [audioInputDevices, setAudioInputDevices] = React.useState<Array<DeviceInfo>>([]);
    const [camDevices, setCamDevices] = React.useState<Array<DeviceInfo>>([]);

    const onMicToggleClick = async () => {
        const newMuteState = !micMuted;

        if (!newMuteState) {
            const devices = await audioVideo.listAudioInputDevices();

            const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                label: x.label,
                value: x.deviceId,
            }));

            setAudioInputDevices(deviceInfos);
        }
        setMicMuted(newMuteState);
    };

    const onCamToggleClick = async () => {
        const newCamState = !camEnabled;

        if (newCamState) {
            const devices = await audioVideo.listVideoInputDevices();
            const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = (e) => {
                    videoRef.current!.play();
                };
            }

            const deviceInfos: Array<DeviceInfo> = devices.map((x) => ({
                label: x.label,
                value: x.deviceId,
            }));

            setCamDevices(deviceInfos);
        }
        setMicMuted(newCamState);
    };

    return (
        <Grid
            className={styles.Container}
            gridProperties={{
                gridTemplateAreas: `
					'Header Header' 
					'CamPreview Selection'
					'CamPreview Selection'
					'CamPreview ContinueButton'
				`,
                gap: "1rem",
                gridTemplateColumns: "1fr 50px",
                gridTemplateRows: "50px repeat(2, 1fr)",
            }}
        >
            <Cell className={styles.Header} gridArea="Header">
                <span>Geräteauswahl</span>
            </Cell>
            <Cell gridArea="CamPreview">
                <Flex className={styles.CamPreview} direction="Column">
                    <video className={styles.VideoPreview} ref={videoRef} />
                    <Flex className={styles.CamToggle} direction="Row">
                        <CamToggle toggleState={camEnabled} onClick={onCamToggleClick} />
                    </Flex>
                </Flex>
            </Cell>
            <Cell gridArea="Selection">
                <Flex direction="Column">
                    <MicrophoneToggle toggleState={micMuted} onClick={onMicToggleClick} />
                </Flex>
            </Cell>
            <Cell gridArea="ContinueButton">
                <button className="btn btn--primary" onClick={onContinue}>
                    OK
                </button>
            </Cell>
        </Grid>
    );
};

export default MeetingStartScreen;
