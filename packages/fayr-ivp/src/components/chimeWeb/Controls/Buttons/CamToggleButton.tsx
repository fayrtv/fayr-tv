// Framework
import * as React from "react";

import useGlobalKeyHandler from "hooks/useGlobalKeyHandler";
import useMeetingMetaData from "hooks/useMeetingMetaData";

import {
    IChimeAudioVideoProvider,
    IChimeDevicePicker,
    IChimeSdkWrapper,
    IDeviceProvider,
} from "components/chime/ChimeSdkWrapper";

import CamToggle from "./CamToggle";

export enum VideoStatus {
    Loading,
    Enabled,
    Disabled,
}

type Props = {
    chime: IChimeSdkWrapper & IChimeAudioVideoProvider & IChimeDevicePicker & IDeviceProvider;
};

export const CamToggleButton = ({ chime }: Props) => {
    const [videoStatus, setVideoStatus] = React.useState(
        chime.currentVideoInputDevice == null ? VideoStatus.Disabled : VideoStatus.Enabled,
    );

    const [meetingMetaData, setMeetingMetaData] = useMeetingMetaData();

    const toggleVideo = async () => {
        if (videoStatus === VideoStatus.Disabled) {
            setVideoStatus(VideoStatus.Loading);

            try {
                if (!chime.currentVideoInputDevice) {
                    const videoInputs = await chime.listVideoInputDevices();
                    const fallbackDevice = {
                        label: videoInputs[0].label,
                        value: videoInputs[0].deviceId,
                    };
                    await chime.chooseVideoInputDevice(fallbackDevice);
                }

                try {
                    await chime.chooseVideoInputDevice(chime.currentVideoInputDevice);
                    setMeetingMetaData({
                        ...meetingMetaData,
                        meetingInputOutputDevices: {
                            ...meetingMetaData.meetingInputOutputDevices,
                            cam: chime.currentVideoInputDevice!,
                        },
                        videoEnabled: true,
                    });
                } catch (err) {
                    const videoInputDevices = await chime.audioVideo.listVideoInputDevices();
                    await chime.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
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

                chime.audioVideo.startLocalVideoTile();

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
            chime.audioVideo.stopLocalVideoTile();
            setVideoStatus(VideoStatus.Disabled);

            setMeetingMetaData({
                ...meetingMetaData,
                meetingInputOutputDevices: {
                    ...meetingMetaData.meetingInputOutputDevices,
                    cam: undefined,
                },
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
