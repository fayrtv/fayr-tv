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

    const [videoStatus, setVideoStatus] = React.useState(
        audioVideoManager.currentVideoInputDevice == null
            ? VideoStatus.Disabled
            : VideoStatus.Enabled,
    );

    const [meetingMetaData, setMeetingMetaData] = useMeetingMetaData();

    const toggleVideo = async () => {
        if (videoStatus === VideoStatus.Disabled) {
            setVideoStatus(VideoStatus.Loading);

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

                setVideoStatus(VideoStatus.Enabled);
            } catch (error) {
                // eslint-disable-next-line
                console.error(error);
                setVideoStatus(VideoStatus.Disabled);

                setMeetingMetaData({
                    ...meetingMetaData,
                    meetingInputOutputDevices: {
                        ...meetingMetaData.meetingInputOutputDevices,
                        cam: undefined,
                    },
                    videoEnabled: false,
                });
            }
        } else if (videoStatus === VideoStatus.Enabled) {
            setVideoStatus(VideoStatus.Loading);
            audioVideoManager.audioVideo.stopLocalVideoTile();
            setVideoStatus(VideoStatus.Disabled);

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
            videoStatus={videoStatus}
            forceVideoDisabled={meetingMetaData.forceVideoDisabled}
            onClick={toggleVideo}
        />
    );
};

export default CamToggleButton;
