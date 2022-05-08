import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useScrollIntoView } from "@mantine/hooks";
import { createStyles, Group, Stack } from "@mantine/core";
import { Button, Text } from "~/components/common";
import { Calendar } from "@mantine/dates";
import { EARLIEST, LATEST, TimeSlot } from "~/components/appointment/types";
import dayjs from "dayjs";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";

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
    slot: [number, number];
    isSelected: boolean;
    onClick: (value: TimeSlot) => void;
    onConfirm: () => void;
}) => {
    const start = `${String(slot[0]).padStart(2, "0")}:00 Uhr`;
    const end = `${String(slot[1]).padStart(2, "0")}:00 Uhr`;

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
    date: Date | null;
    setDate: Dispatch<SetStateAction<Date | null>>;
    selectedSlot: TimeSlot | null;
    setSelectedSlot: Dispatch<SetStateAction<TimeSlot | null>>;
    onConfirm: () => void;
};
export const ChooseAppointment = ({
    date,
    setDate,
    selectedSlot,
    setSelectedSlot,
    onConfirm,
}: Props) => {
    const { classes } = useStyles();

    const storeInfo = useStoreInfo();

    const availableSlots = useMemo(() => {
        const slots: TimeSlot[] = [];
        for (let i = EARLIEST; i < LATEST; i++) {
            slots.push([i, i + 1]);
        }
        return slots;
    }, []);

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
