import RadioSelectGroup, { RadioSelectItem } from "components/RadioSelectGroup";
import React from "react";

const SYNC_SETTINGS: RadioSelectItem[] = [
    {
        id: "catch-up",
        name: "Catch up",
        description: "TODO: make component shared",
    },
];

export default function StreamSettings() {
    const [selected, setSelected] = React.useState(SYNC_SETTINGS[0].id);
    return (
        <RadioSelectGroup
            label="Stream Synchronization Strategy"
            items={SYNC_SETTINGS}
            selected={selected}
            onChange={setSelected}
        />
    );
}
