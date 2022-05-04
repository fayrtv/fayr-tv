// Framework
import { useInjection } from "inversify-react";
import * as React from "react";
import Types from "types/inject";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useMeetingMetaData from "hooks/useMeetingMetaData";

import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

import MicrophoneToggle from "./MicrophoneToggle";

export const MicrophoneToggleButton = () => {
    const [
        { forceMuted, meetingInputOutputDevices, muted },
        setMeetingMetaData,
    ] = useMeetingMetaData();
    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    const toggleMute = async () => {
        if (forceMuted) {
            return;
        }

        if (muted) {
            const audioInputs = await audioVideoManager.listAudioInputDevices();
            if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
                await audioVideoManager.audioVideo?.chooseAudioInputDevice(audioInputs[0].deviceId);
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
                audioVideoManager.audioVideo.realtimeUnmuteLocalAudio();
            }
        } else {
            setMeetingMetaData({
                meetingInputOutputDevices: {
                    ...meetingInputOutputDevices,
                    audioInput: undefined,
                },
                muted: true,
            });
            audioVideoManager.audioVideo.realtimeMuteLocalAudio();
        }

        return Promise.resolve();
    };

    useGlobalKeyHandler(["m", "M", "keyM"], toggleMute);

    React.useEffect(() => {
        if (audioVideoManager.audioVideo) {
            const localChimeCopy = audioVideoManager.audioVideo;

            const onMuteChange = (muted: boolean) =>
                setMeetingMetaData({
                    muted,
                });

            localChimeCopy.realtimeSubscribeToMuteAndUnmuteLocalAudio(onMuteChange);

            return () => localChimeCopy.realtimeUnsubscribeToMuteAndUnmuteLocalAudio(onMuteChange);
        }
    }, [audioVideoManager.audioVideo, setMeetingMetaData]);

    return <MicrophoneToggle enabled={!muted} forceMuted={forceMuted} onClick={toggleMute} />;
};

export default MicrophoneToggleButton;
