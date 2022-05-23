import React, { useCallback, useState } from "react";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import { TimeSlot } from "~/components/appointment/types";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import dayjs from "dayjs";
import { DataStore } from "@aws-amplify/datastore";
import { Appointment } from "~/models";
import { useSession } from "~/hooks/useSession";
import { useStoreInfo } from "~/components/StoreInfoProvider";

const AppointmentPage: NextPageWithLayout = () => {
    const { user, getOrCreateCustomer } = useSession();
    const { id: storeId } = useStoreInfo();
    const [date, setDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isAppointmentSelected, setAppointmentSelected] = useState(false);

    const onConfirm = useCallback(
        async (begin: Date, end: Date, message: string) => {
            if (!user) {
                return;
            }

            const appointment = new Appointment({
                User: await getOrCreateCustomer(),
                appointmentAtStoreId: storeId,
                appointmentUserId: user.id,
                beginDate: begin.toISOString(),
                endDate: end.toISOString(),
                message: message,
            });
            await DataStore.save(appointment);
        },
        [getOrCreateCustomer, storeId, user],
    );

    return (
        <>
            {isAppointmentSelected ? (
                <ConfirmAppointment
                    begin={dayjs(date!).add(selectedSlot![0], "hours").toDate()}
                    end={dayjs(date!).add(selectedSlot![1], "hours").toDate()}
                    onCancel={() => setAppointmentSelected(false)}
                    onConfirm={onConfirm}
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
