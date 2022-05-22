import React, { useEffect, useMemo } from "react";
import { NextPageWithLayout } from "~/types/next-types";

import { GetServerSideProps } from "next";
import { Customer, formatCustomerName } from "~/types/user";
import { Button, Container, Group, Text } from "@mantine/core";
import CreateRefractionProtocol from "~/components/customermanagement/CreateRefractionProtocol";
import { CustomerSelection } from "~/components/customermanagement/CustomerSelection";
import { DataStore, withSSRContext } from "aws-amplify";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { useMediaQuery } from "@mantine/hooks";
import SpectaclePassOverview from "~/components/customermanagement/SpectaclePassOverview";
import { PathBasedTabMenu, useUrlFragment } from "~/components/layout/PathBasedTabMenu";
import { Crumb, Crumbs } from "~/components/Crumbs";
import CustomerOverview from "~/components/customermanagement/CustomerOverview";
import { CirclePlus } from "tabler-icons-react";
import { layoutFactory } from "../../../components/layout/Layout";
import { getCurrentStore } from "../../../helpers/storeLocator";
import { Customer as CustomerEntity } from "~/models";
import { Auth, API } from "aws-amplify";
import {
    CognitoIdentityProviderClient,
    GetUserCommand,
    ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getUsersForCurrentStore } from "~/helpers/cognito";

type ServerSideProps = {
    cred: any;
    customers: any;
    customersOfStore: Array<Customer>;
};

const CustomerManagementRouter: NextPageWithLayout<ServerSideProps> = ({
    customersOfStore,
    cred,
    customers,
}) => {
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
                <PathBasedTabMenu tabs={tabs} pathFragmentName="view" renderTitles={false} />
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

CustomerManagementRouter.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const currentStoreUsers = await getUsersForCurrentStore(req, "eu-central-1_yf1nAYpsJ");

    return {
        props: {
            customersOfStore: currentStoreUsers,
        },
    };
};

export default CustomerManagementRouter;
