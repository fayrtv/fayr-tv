// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import {
    Roster,
    RosterHeader,
    RosterGroup,
    useRosterState,
} from "amazon-chime-sdk-component-library-react";
import React, { useState, ChangeEvent } from "react";

import RosterAttendeeWrapper from "../components/RosterAttendeeWrapper";
import { useNavigation } from "../providers/NavigationProvider";

const MeetingRoster = () => {
    const { roster } = useRosterState();
    const [filter, setFilter] = useState("");
    const { closeRoster } = useNavigation();

    let attendees = Object.values(roster);

    if (filter) {
        attendees = attendees.filter((attendee: any) =>
            attendee?.name.toLowerCase().includes(filter.trim().toLowerCase()),
        );
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const attendeeItems = attendees.map((attendee: any) => {
        const { chimeAttendeeId } = attendee || {};
        return <RosterAttendeeWrapper key={chimeAttendeeId} attendeeId={chimeAttendeeId} />;
    });

    return (
        <Roster className="roster">
            <RosterHeader
                searchValue={filter}
                onSearch={handleSearch}
                onClose={closeRoster}
                title="Present"
                badge={attendees.length}
            />
            <RosterGroup>{attendeeItems}</RosterGroup>
        </Roster>
    );
};

export default MeetingRoster;
