// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
    ControlBar,
    AudioInputControl,
    VideoInputControl,
    ContentShareControl,
    AudioOutputControl,
    ControlBarButton,
    useUserActivityState,
    Dots,
    useDevicePermissionStatus,
    DevicePermissionStatus,
    DeviceLabels,
} from "amazon-chime-sdk-component-library-react";
import React from "react";

import { useNavigation } from "../../providers/NavigationProvider";
import DevicePermissionControl from "../DevicePermissionControl/DevicePermissionControl";
import EndMeetingControl from "../EndMeetingControl";
import { StyledControls } from "./Styled";

const DynamicMeetingControls = () => {
    const { toggleNavbar, closeRoster, showRoster } = useNavigation();
    const { isUserActive } = useUserActivityState();
    const permission = useDevicePermissionStatus();

    const handleToggle = () => {
        if (showRoster) {
            closeRoster();
        }

        toggleNavbar();
    };

    return (
        <StyledControls className="controls" active={!!isUserActive}>
            <ControlBar className="controls-menu" layout="undocked-horizontal" showLabels>
                <ControlBarButton
                    className="mobile-toggle"
                    icon={<Dots />}
                    onClick={handleToggle}
                    label="Menu"
                />
                {permission === DevicePermissionStatus.GRANTED ? (
                    <>
                        <AudioInputControl />
                        <VideoInputControl />
                        <ContentShareControl />
                        <AudioOutputControl />
                    </>
                ) : (
                    <DevicePermissionControl deviceLabels={DeviceLabels.AudioAndVideo} />
                )}

                <EndMeetingControl />
            </ControlBar>
        </StyledControls>
    );
};

export default DynamicMeetingControls;
