import { Button, createStyles, Group, Stack, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useScrollIntoView } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";
import { TimeSlot } from "~/components/appointment/types";

const asDayJS = (dateString: string) => dayjs(new Date(dateString));

const canSelectDate = (availableDays: Date[], date: Date): boolean => {
    return availableDays.map((x) => x.toDateString()).includes(date.toDateString());
};

const fmtTimeOfDay = (dateString: string) =>
    `${new Date(dateString).toLocaleTimeString([], { timeStyle: "short" })} Uhr`;

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
    const start = fmtTimeOfDay(slot.startUTC);
    const end = fmtTimeOfDay(slot.endUTC);

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

    const availableSlotsForSelectedDay = useMemo(
        () =>
            date
                ? availableSlots.filter((x) => {
                      const s = new Date(x.startUTC);
                      const start = dayjs(s);
                      const selectedDay = dayjs(date);
                      return start.isSame(selectedDay, "day");
                  })
                : [],
        [availableSlots, date],
    );

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

    const availableDays = availableSlots
        .map((x) => new Date(x.startUTC))
        .reduce<Date[]>((agg, curr) => {
            const currDateString = curr.toDateString();
            if (!agg.some((x) => x.toDateString() == currDateString)) {
                agg.push(curr);
                return agg;
            }
            return agg;
        }, []);

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
                    excludeDate={(x) => !canSelectDate(availableDays, x)}
                    size="xs"
                    mt="md"
                    value={date}
                    onChange={setDate}
                />
            </Stack>
            {/* IDEA: Use accordion instead: https://mantine.dev/core/accordion/ */}
            {date && (
                <Stack spacing="sm" ref={scrollTargetRef} mb="md">
                    {availableSlotsForSelectedDay.map((slot, n) => (
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
