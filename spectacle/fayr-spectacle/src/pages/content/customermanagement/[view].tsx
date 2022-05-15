import { Group } from "~/components/common";
import React from "react";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { User } from "../../../types/user";
import { Center, Container, Tabs, useMantineTheme } from "@mantine/core";
import CreateRefractionProtocol from "~/components/protocol/CreateRefractionProtocol";
import { useRouter } from "next/router";

type View = "createrefractionprotocol" | "queryspectaclepass" | "showappointments";

const tabMap = new Map<View, number>([
    ["createrefractionprotocol", 0],
    ["queryspectaclepass", 1],
    ["showappointments", 2],
]);

const CustomerManagement: NextPageWithLayout = () => {
    const mantineTheme = useMantineTheme();
    const router = useRouter();

    const view = router.query.view as View;

    const dummyUser: User = {
        email: "max.mustermann@website.de",
        address: "m",
        title: "Dr.",
        emailVerified: true,
        firstName: "Max",
        lastName: "Mustermann",
        newsletter: true,
    };

    let tabView: React.ReactNode = null;
    switch (view) {
        case "createrefractionprotocol":
            tabView = <CreateRefractionProtocol customer={dummyUser} />;
            break;
        case "queryspectaclepass":
            tabView = null;
            break;
        case "showappointments":
            tabView = null;
            break;
    }

    return (
        <>
            <Container sx={(_) => ({ padding: "50px", maxWidth: "100%", width: "100%" })}>
                <Group align="flex-start" direction="row">
                    <Center
                        sx={(_) => ({
                            boxShadow: "0px 0px 5px 0px #000000",
                            padding: "15px",
                            flexGrow: 1,
                        })}
                    >
                        <Tabs
                            variant="pills"
                            orientation="vertical"
                            color={mantineTheme.colors.primary[5]}
                            active={tabMap.get(view)}
                            styles={(_) => ({
                                tabLabel: {
                                    fontSize: 20,
                                },
                            })}
                            onTabChange={(index) => {
                                const correspondingView = Array.from(tabMap.entries()).find(
                                    ([_, val]) => val === index,
                                );
                                router.push(
                                    `/content/customermanagement/${correspondingView?.[0]}`,
                                );
                            }}
                        >
                            <Tabs.Tab label="Refraktionsprotokoll anlegen" p="md" />
                            <Tabs.Tab label="Brillenpass abfragen" p="md" />
                            <Tabs.Tab label="Termine anzeigen" p="md" />
                        </Tabs>
                    </Center>
                    <Center
                        sx={(_) => ({
                            boxShadow: "0px 0px 5px 0px #000000",
                            padding: "15px",
                            flexGrow: 4,
                        })}
                    >
                        {tabView}
                    </Center>
                </Group>
            </Container>
        </>
    );
};

CustomerManagement.layoutProps = {
    Layout: Layout,
};

export default CustomerManagement;
