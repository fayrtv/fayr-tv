import React from "react";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { Customer } from "~/types/user";
import { useMantineTheme } from "@mantine/core";
import CreateRefractionProtocol from "~/components/customermanagement/CreateRefractionProtocol";
import { useRouter } from "next/router";
import { CustomerSelection } from "~/components/customermanagement/CustomerSelection";
import { DataStore, withSSRContext } from "aws-amplify";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { useMediaQuery } from "@mantine/hooks";
import SpectaclePassOverview from "~/components/customermanagement/SpectaclePassOverview";
import { PathBasedTabMenu } from "~/components/layout/PathBasedTabMenu";

type ServerSideProps = {
    customersOfStore: Array<Customer>;
};

const CustomerManagement: NextPageWithLayout<ServerSideProps> = ({ customersOfStore }) => {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

    return !!selectedCustomer ? (
        <PathBasedTabMenu
            tabs={[
                {
                    title: "Refraktionsprotokoll anlegen",
                    slug: "create-refraction-protocol",
                    render: () => <CreateRefractionProtocol customer={selectedCustomer!} />,
                },
                {
                    title: "Brillenpass abfragen",
                    slug: "query-spectacle-pass",
                    render: () => <SpectaclePassOverview customer={selectedCustomer!} />,
                },
                {
                    title: "Termine anzeigen",
                    slug: "show-appointments",
                    render: () => <b>TODO</b>,
                },
            ]}
            pathFragmentName="view"
        />
    ) : (
        <CustomerSelection
            customers={customersOfStore}
            setCustomerSelection={setSelectedCustomer}
        />
    );
};

CustomerManagement.layoutProps = {
    Layout: Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const SSR = withSSRContext({ req });
    const store = SSR.DataStore as typeof DataStore;

    // const currentUserShop = await store.query(UserEntity, x => x.id === currentUser.)

    //const customersOfStore = await store.query(UserEntity, (x) => x.shopID ===

    const dummyCustomerList: Array<Customer> = [
        {
            email: "dummythicc@test.de",
            emailVerified: true,
            firstName: "Dummy",
            lastName: "Thicc",
        },
        {
            email: "hanswurst@test.de",
            emailVerified: false,
            firstName: "Hans",
            lastName: "Wurst",
        },
        {
            email: "wurst@käse.de",
            emailVerified: true,
            firstName: "Wurst",
            lastName: "Case",
        },
    ];

    return {
        props: {
            customersOfStore: dummyCustomerList,
        },
    };
};

export default CustomerManagement;
