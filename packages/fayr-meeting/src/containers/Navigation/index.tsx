// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
    Navbar,
    NavbarHeader,
    NavbarItem,
    Attendees,
    Eye,
    SignalStrength,
    Flex,
    ZoomIn,
    ZoomOut,
    useContentShareState,
} from "amazon-chime-sdk-component-library-react";
import React from "react";

import FeaturedLayout from "../../components/icons/FeaturedLayout";
import GalleryLayout from "../../components/icons/GalleryLayout";
import { useAppState } from "../../providers/AppStateProvider";
import { useNavigation } from "../../providers/NavigationProvider";
import { useVideoTileGridControl } from "../../providers/VideoTileGridProvider";
import { Layout } from "../../types";
import { LocalMediaStreamMetrics } from "../LocalMediaStreamMetrics";

const Navigation: React.FC = () => {
    const { toggleRoster, closeNavbar } = useNavigation();
    const { theme, toggleTheme, layout, setLayout } = useAppState();
    const { sharingAttendeeId } = useContentShareState();
    const { zoomIn, zoomOut } = useVideoTileGridControl();

    return (
        <Navbar className="nav" flexDirection="column" container>
            <NavbarHeader title="Navigation" onClose={closeNavbar} />
            <Flex css="margin-top: 0rem;">
                <NavbarItem icon={<Attendees />} onClick={toggleRoster} label="Attendees" />
                <NavbarItem
                    icon={layout === Layout.Gallery ? <FeaturedLayout /> : <GalleryLayout />}
                    onClick={(): void => {
                        if (layout === Layout.Gallery) {
                            setLayout(Layout.Featured);
                        } else {
                            setLayout(Layout.Gallery);
                        }
                    }}
                    disabled={!!sharingAttendeeId}
                    label="Switch View"
                />
                <NavbarItem
                    icon={<ZoomIn />}
                    onClick={zoomIn}
                    label="Zoom In"
                    style={{
                        display: layout === Layout.Gallery ? "flex" : "none",
                    }}
                    disabled={!!sharingAttendeeId}
                />
                <NavbarItem
                    icon={<ZoomOut />}
                    onClick={zoomOut}
                    label="Zoom Out"
                    style={{
                        display: layout === Layout.Gallery ? "flex" : "none",
                    }}
                />
            </Flex>
            <Flex marginTop="auto">
                <NavbarItem
                    icon={<Eye />}
                    onClick={toggleTheme}
                    label={theme === "light" ? "Dark mode" : "Light mode"}
                />
                <NavbarItem
                    icon={<SignalStrength />}
                    onClick={(): void => {
                        // do nothing
                    }}
                    label="Media metrics"
                >
                    <LocalMediaStreamMetrics />
                </NavbarItem>
            </Flex>
        </Navbar>
    );
};

export default Navigation;
