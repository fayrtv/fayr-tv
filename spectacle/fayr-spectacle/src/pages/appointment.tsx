import { GetServerSideProps } from "next";
import React, { PropsWithChildren, useMemo, useState } from "react";
import dayjs from "dayjs";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { User } from "~/types/user";
import {Badge, Box, createStyles, Group, Paper, Stack, useMantineColorScheme} from "@mantine/core";
import { Button, Text } from "~/components/common";
import { Calendar } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";

const EARLIEST = 8;
const LATEST = 15;

type TimeSlot = [number, number];

type Props = {
    user: User;
};

const canSelectDate = (date: Date): boolean => {
    // No weekends
    return date.getDay() !== 0 && date.getDay() !== 6;
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
        <Group spacing={0} position="apart" grow>
            {/*<Badge variant="dot" size="md" gradient={{ from: "teal", to: "lime", deg: 105 }}>*/}
            {/*    {start}*/}
            {/*</Badge>*/}
            <InfoBox>{start}</InfoBox>

            <Button onClick={() => onClick(slot)} color="green" size="sm" p="sm">
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

const InfoBox = ({ children }: PropsWithChildren<{}>) => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Paper sx={(theme) => ({ backgroundColor: theme.colors.primary[3] })} py={7} px="sm">
            <Text size="sm" color="primary">
                {children}
            </Text>
        </Paper>
    );
};

const useStyles = createStyles((theme, _params, getRef) => ({
    wrapper: {
        // subscribe to color scheme changes right in your styles
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        maxWidth: 400,
        width: '100%',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: theme.radius.sm,

        // Dynamic media queries, define breakpoints in theme, use anywhere
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            // Type safe child reference in nested selectors via ref
            [`& .${getRef('child')}`]: {
                fontSize: theme.fontSizes.xs,
            },
        },
    },

    child: {
        // assign ref to element
        ref: getRef('child'),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        boxShadow: theme.shadows.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
}));
const Welcome: NextPageWithLayout<Props> = ({ user }) => {
    const { colorScheme } = useMantineColorScheme();
    const isMobile = useMediaQuery("(min-width: 500px)", false);

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
        <Group
            direction={isMobile ? "row" : "column"}
            spacing="md"
            {...(isMobile ? { position: "center" } : { align: "center" })}
            mt="md"
        >
            <Stack spacing={0} align="center">
                <Text weight="bold" size="md">
                    Termin vereinbaren
                </Text>
                <Text size="sm">Besuchen Sie uns in unserer Filiale</Text>
                <Text size="sm" color="primary">
                    {shopAddress}
                </Text>
                <Calendar
                    minDate={dayjs(new Date()).toDate()}
                    excludeDate={(x) => !canSelectDate(x)}
                    size="xs"
                    mt="md"
                    value={date}
                    onChange={setDate}
                />
            </Stack>
            {/* IDEA: Use accordion instead: https://mantine.dev/core/accordion/ */}
            {date && (
                <Stack spacing="sm">
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
        </Group>
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
