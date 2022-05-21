import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { Customer, formatCustomerName, formatFormalAddress } from "~/types/user";
import {
    Anchor,
    Breadcrumbs,
    Button,
    Container,
    Group,
    Text,
    useMantineTheme,
} from "@mantine/core";
import CreateRefractionProtocol from "~/components/customermanagement/CreateRefractionProtocol";
import { useRouter } from "next/router";
import { CustomerSelection } from "~/components/customermanagement/CustomerSelection";
import { DataStore, withSSRContext } from "aws-amplify";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { useMediaQuery } from "@mantine/hooks";
import SpectaclePassOverview from "~/components/customermanagement/SpectaclePassOverview";
import { PathBasedTabMenu, Tab, useUrlFragment } from "~/components/layout/PathBasedTabMenu";
import Link from "next/link";
import { Crumb, Crumbs } from "~/components/Crumbs";
import CustomerOverview from "~/components/customermanagement/CustomerOverview";
import { CirclePlus } from "tabler-icons-react";
import { layoutFactory } from "../../../components/layout/Layout";

type ServerSideProps = {
    customersOfStore: Array<Customer>;
};

const CustomerManagement: NextPageWithLayout<ServerSideProps> = ({ customersOfStore }) => {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);

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
            render: () => <b>TODO</b>,
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
        const result: Crumb[] = [
            { title: "Kundenverwaltung", href: "/content/customermanagement" },
        ];

        if (selectedCustomer) {
            result.push({
                title: formatCustomerName(selectedCustomer),
                href: "/content/customermanagement/overview",
            });
        }

        if (currentTab && currentTab.slug !== "overview") {
            result.push({
                title: currentTab.title,
                href: "/content/customermanagement/overview",
            });
        }

        return result;
    }, [currentTab, selectedCustomer]);

    return (
        <Container
            size="lg"
            sx={{
                padding: isMobile ? "10px" : "50px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            <Crumbs items={items} />
            {!!selectedCustomer ? (
                <PathBasedTabMenu tabs={tabs} pathFragmentName="view" />
            ) : (
                <>
                    <Group position="right" grow={false}>
                        <Button size="xs" leftIcon={<CirclePlus />}>
                            {!isMobile && <Text size="sm">Neues Kundenkonto</Text>}
                        </Button>
                    </Group>

                    <CustomerSelection
                        customers={customersOfStore}
                        setCustomerSelection={setSelectedCustomer}
                    />
                </>
            )}
        </Container>
    );
};

CustomerManagement.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
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
