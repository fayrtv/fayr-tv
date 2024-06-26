// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
    ControlBar,
    AudioInputVFControl,
    AudioInputControl,
    VideoInputBackgroundBlurControl,
    ContentShareControl,
    AudioOutputControl,
    ControlBarButton,
    useUserActivityState,
    Dots,
    VideoInputControl,
} from "amazon-chime-sdk-component-library-react";
import React from "react";

import { useAppState } from "../../providers/AppStateProvider";
import { useNavigation } from "../../providers/NavigationProvider";
import { BlurValues } from "../../types";
import EndMeetingControl from "../EndMeetingControl";
import { StyledControls } from "./Styled";

const MeetingControls: React.FC = () => {
    const { toggleNavbar, closeRoster, showRoster } = useNavigation();
    const { isUserActive } = useUserActivityState();
    const { isWebAudioEnabled, blurOption } = useAppState();
    const isBackgroundBlurEnabled = blurOption !== BlurValues.blurDisabled;

    const handleToggle = (): void => {
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
                {isWebAudioEnabled ? <AudioInputVFControl /> : <AudioInputControl />}
                {isBackgroundBlurEnabled ? (
                    <VideoInputBackgroundBlurControl />
                ) : (
                    <VideoInputControl />
                )}
                <ContentShareControl />
                <AudioOutputControl />
                <EndMeetingControl />
            </ControlBar>
        </StyledControls>
    );
};

export default MeetingControls;
