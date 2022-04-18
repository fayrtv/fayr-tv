// Framework
import { useInjection } from "inversify-react";
import * as React from "react";
import Types from "types/inject";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useMeetingMetaData from "hooks/useMeetingMetaData";

import IAudioVideoManager from "components/chime/interfaces/IAudioVideoManager";

import CamToggle from "./CamToggle";

export enum VideoStatus {
    Loading,
    Enabled,
    Disabled,
}

export const CamToggleButton = () => {
    const audioVideoManager = useInjection<IAudioVideoManager>(Types.IAudioVideoManager);

    const [meetingMetaData, setMeetingMetaData] = useMeetingMetaData();

    const toggleVideo = async () => {
        if (!meetingMetaData.videoEnabled) {
            try {
                if (!audioVideoManager.currentVideoInputDevice) {
                    const videoInputs = await audioVideoManager.listVideoInputDevices();
                    const fallbackDevice = {
                        label: videoInputs[0].label,
                        value: videoInputs[0].deviceId,
                    };
                    await audioVideoManager.setVideoInputDeviceSafe(fallbackDevice);
                }

                try {
                    await audioVideoManager.setVideoInputDeviceSafe(
                        audioVideoManager.currentVideoInputDevice,
                    );
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            cam: audioVideoManager.currentVideoInputDevice!,
                        },
                        videoEnabled: true,
                    });
                } catch (err) {
                    const videoInputDevices =
                        await audioVideoManager.audioVideo.listVideoInputDevices();
                    await audioVideoManager.audioVideo.chooseVideoInputDevice(
                        videoInputDevices[0].deviceId,
                    );
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            cam: {
                                label: videoInputDevices[0].label,
                                value: videoInputDevices[0].deviceId,
                            },
                        },
                        videoEnabled: true,
                    });
                }

                audioVideoManager.audioVideo.startLocalVideoTile();
            } catch (error) {
                // eslint-disable-next-line
                console.error(error);

                setMeetingMetaData({
                    ...meetingMetaData,
                    meetingInputOutputDevices: {
                        ...meetingMetaData.meetingInputOutputDevices,
                        cam: undefined,
                    },
                    videoEnabled: false,
                });
            }
        } else {
            audioVideoManager.audioVideo.stopLocalVideoTile();

            setMeetingMetaData({
                ...meetingMetaData,
                meetingInputOutputDevices: {
                    ...meetingMetaData.meetingInputOutputDevices,
                    cam: undefined,
                },
                videoEnabled: false,
            });
        }
    };

    useGlobalKeyHandler(["c", "C", "keyC"], toggleVideo);

    return (
        <CamToggle
            videoEnabled={meetingMetaData.videoEnabled}
            forceVideoDisabled={meetingMetaData.forceVideoDisabled}
            onClick={toggleVideo}
        />
    );
};

export default CamToggleButton;
