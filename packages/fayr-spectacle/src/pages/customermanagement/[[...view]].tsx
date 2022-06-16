import React, { useEffect, useMemo } from "react";
import { NextPageWithLayout } from "~/types/next-types";

import { GetServerSideProps } from "next";
import { Customer, formatCustomerName } from "~/types/user";
import { Button, Group, Text } from "@mantine/core";
import CreateRefractionProtocol from "~/components/customermanagement/CreateRefractionProtocol";
import { CustomerSelection } from "~/components/customermanagement/CustomerSelection";
import SpectaclePassOverview from "~/components/customermanagement/SpectaclePassOverview";
import { PathBasedTabMenu, useUrlFragment } from "~/components/layout/PathBasedTabMenu";
import { Crumb } from "~/components/Crumbs";
import CustomerOverview from "~/components/customermanagement/CustomerOverview";
import { Link as LinkIcon } from "tabler-icons-react";
import { layoutFactory } from "src/components/layout/Layout";
import { getStoreCustomers } from "~/helpers/cognito";
import Link from "next/link";
import MainContainer from "~/components/layout/MainContainer";
import { getCurrentStore } from "~/helpers/storeLocator";
import AppointmentsOverview from "~/components/customermanagement/AppointmentsOverview";

type ServerSideProps = {
    cred: any;
    customers: any;
    customersOfStore: Array<Customer>;
};

const CustomerManagementRouter: NextPageWithLayout<ServerSideProps> = ({ customersOfStore }) => {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

    const tabs = [
        {
            title: "Übersicht",
            slug: "overview",
            render: () => <CustomerOverview customer={selectedCustomer!} />,
        },
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
            render: () => <AppointmentsOverview customer={selectedCustomer!} />,
        },
    ];

    const urlFragment = useUrlFragment("view");
    const currentTab = tabs.find((x) => x.slug === urlFragment);

    useEffect(() => {
        if (!currentTab) {
            setSelectedCustomer(undefined);
        }
    }, [currentTab]);

    const items = useMemo(() => {
        const result: Crumb[] = [{ title: "Kundenverwaltung", href: "/customermanagement" }];

        if (selectedCustomer) {
            result.push({
                title: formatCustomerName(selectedCustomer),
                href: "/customermanagement/overview",
            });
        }

        if (currentTab && currentTab.slug !== "overview") {
            result.push({
                title: currentTab.title,
                href: "/customermanagement/overview",
            });
        }

        return result;
    }, [currentTab, selectedCustomer]);

    return (
        <MainContainer crumbs={items}>
            {!!selectedCustomer ? (
                <PathBasedTabMenu tabs={tabs} pathFragmentName="view" renderTitles={false} />
            ) : (
                <>
                    <Group position="right" grow={false}>
                        <Link href="link-existing" passHref>
                            <Button size="xs" leftIcon={<LinkIcon />}>
                                Kundenkonto verknüpfen
                            </Button>
                        </Link>
                    </Group>

                    <CustomerSelection
                        customers={customersOfStore}
                        setCustomerSelection={setSelectedCustomer}
                    />
                </>
            )}
        </MainContainer>
    );
};

CustomerManagementRouter.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: true,
        },
    }),
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const store = await getCurrentStore(req);
    const currentStoreUsers = await getStoreCustomers(req, store, "eu-central-1_yf1nAYpsJ");

    return {
        props: {
            customersOfStore: currentStoreUsers as Customer[],
        },
    };
};

export default CustomerManagementRouter;
