import React, { useEffect, useMemo } from "react";
import { NextPageWithLayout } from "~/types/next-types";

import { GetServerSideProps } from "next";
import { Customer, formatCustomerName } from "~/types/user";
import { Button, Container, Group, Text } from "@mantine/core";
import CreateRefractionProtocol from "~/components/customermanagement/CreateRefractionProtocol";
import { CustomerSelection } from "~/components/customermanagement/CustomerSelection";
import SpectaclePassOverview from "~/components/customermanagement/SpectaclePassOverview";
import { PathBasedTabMenu, useUrlFragment } from "~/components/layout/PathBasedTabMenu";
import { Crumb, Crumbs } from "~/components/Crumbs";
import CustomerOverview from "~/components/customermanagement/CustomerOverview";
import { CirclePlus, Link as LinkIcon } from "tabler-icons-react";
import { layoutFactory } from "src/components/layout/Layout";
import { getStoreCustomers } from "~/helpers/cognito";
import { SwitchAvailability } from "~/components/layout/SubHeader";
import useIsMobile from "~/hooks/useIsMobile";
import Link from "next/link";
import ContentBody from "~/components/layout/ContentBody";
import { getCurrentStore } from "~/helpers/storeLocator";

type ServerSideProps = {
    cred: any;
    customers: any;
    customersOfStore: Array<Customer>;
};

const CustomerManagementRouter: NextPageWithLayout<ServerSideProps> = ({ customersOfStore }) => {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

    const isMobile = useIsMobile();

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
        <ContentBody>
            <Crumbs items={items} />
            {!!selectedCustomer ? (
                <PathBasedTabMenu tabs={tabs} pathFragmentName="view" renderTitles={false} />
            ) : (
                <>
                    <Group position="right" grow={false}>
                        <Link href="link-existing" passHref>
                            <Button size="xs" leftIcon={<LinkIcon />}>
                                {!isMobile && <Text size="sm">Kundenkonto verknüpfen</Text>}
                            </Button>
                        </Link>
                    </Group>

                    <CustomerSelection
                        customers={customersOfStore}
                        setCustomerSelection={setSelectedCustomer}
                    />
                </>
            )}
        </ContentBody>
    );
};

CustomerManagementRouter.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: true,
            props: {
                switchAvailability: SwitchAvailability.OpticianOnly,
            },
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
