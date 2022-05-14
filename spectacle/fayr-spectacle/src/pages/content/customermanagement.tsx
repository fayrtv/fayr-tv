import { Group, Box } from "~/components/common";
import React from "react";
import { NextPageWithLayout } from "~/types/next-types";
import SubHeader, { SwitchAvailability } from "~/components/layout/SubHeader";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { getUser } from "~/helpers/authentication";
import { User } from "../../types/user";
import { Container, Paper, Tabs } from "@mantine/core";
import CreateRefractionProtocol from "~/components/protocol/CreateRefractionProtocol";

type ServerSideProps = {
    user: User;
};

enum View {
    CreateRefractionProtcoll,
    QuerySpectaclePass,
    ShowAppointments,
}

const CustomerManagement: NextPageWithLayout<ServerSideProps> = ({ user }: ServerSideProps) => {
    const [activeTab, setActiveTab] = React.useState<View>(View.CreateRefractionProtcoll);

    let tabView: React.ReactNode = null;

    switch (activeTab) {
        case View.CreateRefractionProtcoll:
            tabView = <CreateRefractionProtocol customer={user} />;
            break;
        case View.QuerySpectaclePass:
            tabView = null;
            break;
        case View.ShowAppointments:
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
                            active={activeTab}
                            onTabChange={setActiveTab}
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
