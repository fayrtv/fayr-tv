// Framework
import * as React from "react";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useMeetingMetaData from "hooks/useMeetingMetaData";

import {
    IChimeAudioVideoProvider,
    IChimeSdkWrapper,
    IDeviceProvider,
} from "components/chime/ChimeSdkWrapper";

import MicrophoneToggle from "./MicrophoneToggle";

type Props = {
    chime: IChimeAudioVideoProvider & IDeviceProvider & IChimeSdkWrapper;
    forceMuted?: boolean;
};

export const MicrophoneToggleButton = ({ chime }: Props) => {
    const [{ forceMuted, meetingInputOutputDevices, muted }, setMeetingMetaData] =
        useMeetingMetaData();

    const toggleMute = async () => {
        if (forceMuted) {
            return;
        }

        if (muted) {
            const audioInputs = await chime.listAudioInputDevices();
            if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
                await chime.audioVideo?.chooseAudioInputDevice(audioInputs[0].deviceId);
                setMeetingMetaData({
                    meetingInputOutputDevices: {
                        ...meetingInputOutputDevices,
                        audioInput: {
                            value: audioInputs[0].deviceId,
                            label: audioInputs[0].label,
                        },
                    },
                    muted: false,
                });
                chime.audioVideo.realtimeUnmuteLocalAudio();
            }
        } else {
            setMeetingMetaData({
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    audioInput: undefined,
                },
                muted: true,
            });
            chime.audioVideo.realtimeMuteLocalAudio();
        }

        return Promise.resolve();
    };

    useGlobalKeyHandler(["m", "M", "keyM"], toggleMute);

    React.useEffect(() => {
        if (chime.audioVideo) {
            const localChimeCopy = chime.audioVideo;

            const onMuteChange = (muted: boolean) =>
                setMeetingMetaData({
                    muted,
                });

            localChimeCopy.realtimeSubscribeToMuteAndUnmuteLocalAudio(onMuteChange);

            return () => localChimeCopy.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(onMuteChange);
        }
    }, [chime.audioVideo, setMeetingMetaData]);

    return (
        <MicrophoneToggle
            enabled={!muted}
            forceMuted={forceMuted}
            onClick={toggleMute}
            key="mictoggle"
        />
    );
};

export default MicrophoneToggleButton;
