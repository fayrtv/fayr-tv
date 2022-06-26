import { createStyles, Group, Stack } from "@mantine/core";
import { Button, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useScrollIntoView } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";
import { EARLIEST, LATEST, TimeSlot } from "~/components/appointment/types";

const canSelectDate = (date: Date): boolean => {
    // No weekends
    return date.getDay() !== 0 && date.getDay() !== 6;
};

const TimeRangeSelectItem = ({
    slot,
    isSelected,
    onClick,
    onConfirm,
}: {
    slot: TimeSlot;
    isSelected: boolean;
    onClick: (value: TimeSlot) => void;
    onConfirm: () => void;
}) => {
    const start = `${new Date(slot.startUTC).toLocaleTimeString([], { timeStyle: "short" })} Uhr`;
    const end = `${new Date(slot.endUTC).toLocaleTimeString([], { timeStyle: "short" })} Uhr`;

    return isSelected ? (
        <Group spacing={0} position="apart" grow>
            <InfoBox>{start}</InfoBox>

            <Button onClick={onConfirm} color="green" size="sm" p="sm">
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

const useStyles = createStyles((theme) => ({
    container: {
        marginTop: `${theme.spacing.md}px`,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        gap: `${theme.spacing.md}px`,
        alignItems: "end",

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            flexDirection: "column",
            alignItems: "center",
        },
    },
}));

type Props = {
    availableSlots: TimeSlot[];
    date: Date | null;
    setDate: Dispatch<SetStateAction<Date | null>>;
    selectedSlot: TimeSlot | null;
    setSelectedSlot: Dispatch<SetStateAction<TimeSlot | null>>;
    onConfirm: () => void;
};
export const ChooseAppointment = ({
    availableSlots,
    date,
    setDate,
    selectedSlot,
    setSelectedSlot,
    onConfirm,
}: Props) => {
    const { classes } = useStyles();

    const storeInfo = useStoreInfo();

    const { scrollIntoView, targetRef: scrollTargetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 0,
    });

    useEffect(() => {
        setSelectedSlot(null);
        if (scrollTargetRef.current) {
            scrollIntoView();
        }
        // eslint-disable-next-line
    }, [date]);

    return (
        <div className={classes.container}>
            <Stack spacing={0} align="center">
                <Text weight="bold" size="md">
                    Termin vereinbaren
                </Text>
                <Text size="sm">Besuchen Sie uns in unserer Filiale</Text>
                <Text size="sm" color="primary">
                    {storeInfo.fullAddress}
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
                <Stack spacing="sm" ref={scrollTargetRef} mb="md">
                    {availableSlots.map((slot, n) => (
                        <TimeRangeSelectItem
                            isSelected={slot === selectedSlot}
                            onClick={setSelectedSlot}
                            onConfirm={onConfirm}
                            slot={slot}
                            key={n}
                        />
                    ))}
                </Stack>
            )}
        </div>
    );
};
