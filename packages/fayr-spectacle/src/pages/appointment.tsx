import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import Layout from "~/components/layout/Layout";
import MainContainer from "~/components/layout/MainContainer";
import { NextPageWithLayout } from "~/types/next-types";
import { TimeSlot } from "~/components/appointment/types";
import { fetchAvailability } from "~/timekit/timekitClient";

type ServerProps = {
    availableSlots: TimeSlot[];
};

const AppointmentPage: NextPageWithLayout<ServerProps> = ({ availableSlots }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isAppointmentSelected, setAppointmentSelected] = useState(false);

    return (
        <MainContainer>
            {isAppointmentSelected ? (
                <ConfirmAppointment
                    timeSlot={selectedSlot!}
                    onCancel={() => setAppointmentSelected(false)}
                />
            ) : (
                <ChooseAppointment
                    availableSlots={availableSlots}
                    date={date}
                    setDate={setDate}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    onConfirm={() => setAppointmentSelected(true)}
                />
            )}
        </MainContainer>
    );
};

AppointmentPage.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async () => {
    const availableSlots: TimeSlot[] = (await fetchAvailability()).map((x) => ({
        startUTC: x.start,
        endUTC: x.end,
        resourceID: x.resources[0].id
    }));
    console.log(availableSlots);
    return {
        props: { availableSlots },
    };
};

export default AppointmentPage;
