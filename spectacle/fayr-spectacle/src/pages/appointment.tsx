import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { User } from "~/types/user";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import { TimeSlot } from "~/components/appointment/types";

type Props = {
    user: User;
};

const AppointmentPage: NextPageWithLayout<Props> = ({ user }) => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    return (
        <ChooseAppointment
            date={date}
            setDate={setDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
        />
    );
};

AppointmentPage.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    return {
        props: {},
    };
};

export default AppointmentPage;
