import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { User } from "~/types/user";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import { TimeSlot } from "~/components/appointment/types";
import Confirm from "~/pages/auth/confirm";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import dayjs from "dayjs";
import SubHeader, { SwitchAvailability } from "~/components/layout/SubHeader";
import { getUser } from "~/helpers/authentication";

const AppointmentPage: NextPageWithLayout = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isAppointmentSelected, setAppointmentSelected] = useState(false);

    return (
        <>
            {isAppointmentSelected ? (
                <ConfirmAppointment
                    begin={dayjs(date!).add(selectedSlot![0], "hours").toDate()}
                    end={dayjs(date!).add(selectedSlot![1], "hours").toDate()}
                    onCancel={() => setAppointmentSelected(false)}
                />
            ) : (
                <ChooseAppointment
                    date={date}
                    setDate={setDate}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    onConfirm={() => setAppointmentSelected(true)}
                />
            )}
        </>
    );
};

AppointmentPage.layoutProps = {
    Layout,
};

export default AppointmentPage;
