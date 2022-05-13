import { Group } from "~/components/common";
import React from "react";
import { NextPageWithLayout } from "~/types/next-types";
import SubHeader, { SwitchAvailability } from "~/components/layout/SubHeader";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { getUser } from "~/helpers/authentication";
import { User } from "../../types/user";

type ServerSideProps = {
    user: User;
};

const CustomerManagement: NextPageWithLayout<ServerSideProps> = ({ user }: ServerSideProps) => {
    return (
        <>
            <SubHeader
                user={user}
                switchAvailability={SwitchAvailability.Both}
                showAppointmentCTA={false}
            />
            <Group direction="row"></Group>
        </>
    );
};

CustomerManagement.layoutProps = {
    Layout: Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    return {
        props: {
            user: await getUser(req),
        },
    };
};

export default CustomerManagement;
