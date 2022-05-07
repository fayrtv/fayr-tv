import { GetServerSideProps } from "next";
import React, { useMemo, useState } from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { User } from "~/types/user";
import { Badge, Group, Stack, useMantineColorScheme } from "@mantine/core";
import { Button, Text } from "~/components/common";
import { Calendar } from "@mantine/dates";

const EARLIEST = 8;
const LATEST = 15;

type TimeSlot = [number, number];

type Props = {
    user: User;
};

const TimeRangeSelectItem = ({
    slot,
    isSelected,
    onClick,
}: {
    slot: [number, number];
    isSelected: boolean;
    onClick: (value: TimeSlot) => void;
}) => {
    const start = `${String(slot[0]).padStart(2, "0")}:00 Uhr`;
    const end = `${String(slot[1]).padStart(2, "0")}:00 Uhr`;

    return isSelected ? (
        <Group>
            <Badge variant="gradient" size="md" gradient={{ from: "teal", to: "lime", deg: 105 }}>
                {start}
            </Badge>
            <Button onClick={() => onClick(slot)} color="green">
                Auswählen
            </Button>
        </Group>
    ) : (
        <Button variant="outline" onClick={() => onClick(slot)}>
            <Text color="primary" size="sm">
                {start} bis {end}
            </Text>
        </Button>
    );
};

const Welcome: NextPageWithLayout<Props> = ({ user }) => {
    const { colorScheme } = useMantineColorScheme();
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const shopAddress = "Lorzingstraße 4, 49074 Osnabrück";

    const availableSlots = useMemo(() => {
        const slots: TimeSlot[] = [];
        for (let i = EARLIEST; i < LATEST; i++) {
            slots.push([i, i + 1]);
        }
        return slots;
    }, []);

    useMemo(() => {
        setSelectedSlot(null);
        // eslint-disable-next-line
    }, [date]);

    return (
        <Stack spacing={0} align="center">
            <Text weight="bold" size="md">
                Termin vereinbaren
            </Text>
            <Text size="sm">Besuchen Sie uns in unserer Filiale</Text>
            <Text size="sm" color="primary">
                {shopAddress}
            </Text>
            <Calendar size="xs" mt="md" value={date} onChange={setDate} />
            {/* IDEA: Use accordion instead: https://mantine.dev/core/accordion/ */}
            {date && (
                <Stack spacing="sm" mt="md">
                    {availableSlots.map((slot, n) => (
                        <TimeRangeSelectItem
                            isSelected={slot === selectedSlot}
                            onClick={setSelectedSlot}
                            slot={slot}
                            key={n}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

Welcome.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    return {
        props: {},
    };
};

export default Welcome;
