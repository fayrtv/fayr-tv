import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { ChooseAppointment } from "~/components/appointment/ChooseAppointment";
import ConfirmAppointment from "~/components/appointment/ConfirmAppointment";
import Layout from "~/components/layout/Layout";
import MainContainer from "~/components/layout/MainContainer";
import { NextPageWithLayout } from "~/types/next-types";
import { TimeSlot } from "~/components/appointment/types";
import { fetchAvailability, getAllResources, getProjectResourceIDs } from "~/timekit/timekitClient";

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
    // noinspection ES6MissingAwait
    const [projectResourceIDs, allResources] = await Promise.all([
        getProjectResourceIDs(),
        getAllResources(),
    ]);

    const projectResources = allResources.filter((x) => projectResourceIDs.includes(x.id));

    // As we do not support multiple resources for a given project, we try to choose the first one we find to be an
    // asset, not a person. Otherwise, we simply choose the first.
    // This could arguably be confusing during setup, but otherwise we put the burden of assigning the correct resource
    // type in Timekit on whoever sets it up.
    const chosenResource =
        projectResources.find((x) => x.email.startsWith("resource+")) ?? projectResources[0];

    return {
        props: { availableSlots: await fetchAvailability(chosenResource.id) },
    };
};

/**
 * https://stackoverflow.com/a/41289050/3827785
 */
interface PromiseConstructor {
    all<T1, T2>(values: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
}

export default AppointmentPage;
