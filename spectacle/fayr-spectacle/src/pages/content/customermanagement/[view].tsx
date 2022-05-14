import { Group, Box } from "~/components/common";
import React from "react";
import { NextPageWithLayout } from "~/types/next-types";
import SubHeader, { SwitchAvailability } from "~/components/layout/SubHeader";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { getUser } from "~/helpers/authentication";
import { User } from "../../../types/user";
import { Container, Paper, Tabs } from "@mantine/core";
import CreateRefractionProtocol from "~/components/protocol/CreateRefractionProtocol";
import { useRouter } from "next/router";

type ServerSideProps = {
    user: User;
};

type View = "createrefractionprotocol" | "queryspectaclepass" | "showappointments";

const tabMap = new Map<View, number>([
    ["createrefractionprotocol", 0],
    ["queryspectaclepass", 1],
    ["showappointments", 2],
]);

const CustomerManagement: NextPageWithLayout<ServerSideProps> = ({ user }: ServerSideProps) => {
    const router = useRouter();

    const view = router.query.view as View;

    let tabView: React.ReactNode = null;
    switch (view) {
        case "createrefractionprotocol":
            tabView = <CreateRefractionProtocol customer={user} />;
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
            <SubHeader
                user={user}
                switchAvailability={SwitchAvailability.OpticianOnly}
                showAppointmentCTA={false}
            />
            <Container sx={(_) => ({ margin: "0", maxWidth: "100%", width: "100%" })}>
                <Group direction="row">
                    <Paper sx={(_) => ({ border: "1px solid black" })}>
                        <Tabs
                            variant="pills"
                            orientation="vertical"
                            active={tabMap.get(view)}
                            onTabChange={(index) => {
                                const correspondingView = Array.from(tabMap.entries()).find(
                                    ([_, val]) => val === index,
                                );
                                router.push(
                                    `/content/customermanagement/${correspondingView?.[0]}`,
                                );
                            }}
                        >
                            <Tabs.Tab label="Refraktionsprotokoll anlegen" />
                            <Tabs.Tab label="Brillenpass abfragen" />
                            <Tabs.Tab label="Termine anzeigen" />
                        </Tabs>
                    </Paper>
                    <Box sx={(_) => ({ flexGrow: 1 })}>{tabView}</Box>
                </Group>
            </Container>
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
