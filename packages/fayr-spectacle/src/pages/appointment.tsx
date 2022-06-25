import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import Layout from "~/components/layout/Layout";
import MainContainer from "~/components/layout/MainContainer";
import { NextPageWithLayout } from "~/types/next-types";
import { TimeSlot } from "~/components/appointment/types";

type ServerProps = {
    unavailableSlots: TimeSlot[];
};

const AppointmentPage: NextPageWithLayout<ServerProps> = ({ unavailableSlots }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isAppointmentSelected, setAppointmentSelected] = useState(false);

    return (
        <MainContainer>
            {isAppointmentSelected ? (
                <ConfirmAppointment
                    begin={dayjs(date!).add(selectedSlot![0], "hours").toDate()}
                    end={dayjs(date!).add(selectedSlot![1], "hours").toDate()}
                    onCancel={() => setAppointmentSelected(false)}
                />
            ) : (
                <ChooseAppointment
                    unavailableSlots={unavailableSlots}
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
    return {
        props: { unavailableSlots: [] },
    };
};

export default AppointmentPage;
