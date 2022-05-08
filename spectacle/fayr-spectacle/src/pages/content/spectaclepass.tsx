import { Container, Group, Space, Stack, Text } from "~/components/common";
import React from "react";
import { CircleX } from "tabler-icons-react";
import { RefractionProtocol } from "~/components/RefractionProtocol";
import RefractionProtocolArchive from "~/components/RefractionProtocolArchive";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { getUser } from "~/helpers/authentication";
import { DataStore } from "@aws-amplify/datastore";
import { withSSRContext } from "aws-amplify";
import { serializeModel } from "@aws-amplify/datastore/ssr";

type ServerProps = {
    refractionProtocols: RefractionProtocolEntity[];
};

const SpectaclePassPage: NextPageWithLayout<ServerProps> = ({ refractionProtocols }) => {
    const currentProtocol = refractionProtocols[0];
    const protocolHistory = refractionProtocols.splice(1);

    return (
        <Container
            fluid
            sx={(theme) => ({ backgroundColor: theme.colors.dark[3], height: "100%" })}
        >
            <Stack>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container size="xl">
                    <Group direction="column" position="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">Max Mustermann</Text>
                    </Group>
                    <RefractionProtocol areActionsAllowed={true} entity={currentProtocol} />
                    <Space h="lg" />
                    <RefractionProtocolArchive protocolHistory={protocolHistory} />
                </Container>
            </Stack>
        </Container>
    );
};

SpectaclePassPage.layoutProps = {
    Layout: Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const SSR = withSSRContext({ req });
    const store = SSR.DataStore as typeof DataStore;

    const user = await getUser(req);
    if (!user) {
        res.writeHead(301, { Location: "/auth/signin" });
        res.end();
        return { props: {} };
    }

    const userProtocols = await store.query(RefractionProtocolEntity, (x) =>
        x.userID("eq", user.email),
    );

    if (!userProtocols || userProtocols.length === 0) {
        // Create some dummy entries if none exist yet
        const dummy: RefractionProtocolModel = {
            left: {
                axis: 170,
                cylinder: -0.25,
                pd: 35,
                sphere: -2.5,
                addition: undefined,
            },
            right: {
                axis: 168,
                cylinder: -0.75,
                pd: 34.5,
                sphere: -1.75,
                addition: undefined,
            },
        };
        await store.save(
            new RefractionProtocolEntity({
                recordedAt: new Date().toISOString(),
                data: JSON.stringify(dummy),
                userID: user.email,
            }),
        );
    }

    return {
        props: {
            refractionProtocols: userProtocols.map(serializeModel),
        },
    };
};

export default SpectaclePassPage;
