import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { InlineWidget } from "react-calendly";
import { getUnavailableSlots, TimeSlot } from "~/calendly/events";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import Layout from "~/components/layout/Layout";
import MainContainer from "~/components/layout/MainContainer";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    unavailableSlots: TimeSlot[];
};

const AppointmentPage: NextPageWithLayout<ServerProps> = ({ unavailableSlots }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isAppointmentSelected, setAppointmentSelected] = useState(false);

    return (
        <MainContainer>
            <div className="App">
                <InlineWidget url="https://calendly.com/development-fayr" />
            </div>
            {isAppointmentSelected ? (
                <ConfirmAppointment
                    begin={dayjs(date!).add(selectedSlot!.startUTC, "hours").toDate()}
                    end={dayjs(date!).add(selectedSlot!.endUTC, "hours").toDate()}
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
        props: { unavailableSlots: await getUnavailableSlots() },
    };
};

export default AppointmentPage;
