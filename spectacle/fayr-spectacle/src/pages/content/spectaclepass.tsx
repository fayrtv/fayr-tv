import { Container, Group, Space, Stack, Text } from "~/components/common";
import React from "react";
import { CircleX, LetterF } from "tabler-icons-react";
import { RefractionProtocol } from "~/components/RefractionProtocol";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { getUser } from "~/helpers/authentication";
import { DataStore } from "@aws-amplify/datastore";
import { withSSRContext } from "aws-amplify";
import { serializeModel } from "@aws-amplify/datastore/ssr";
import { Moment } from "moment";
import moment from "moment";

type ServerProps = {
    refractionProtocols: RefractionProtocolEntity[];
};

const SpectaclePassPage: NextPageWithLayout<ServerProps> = ({ refractionProtocols }) => {
    const sortedProtocols = React.useMemo(() => {
        type SortCompatibleProtocol = {
            protocol: RefractionProtocolEntity;
            createdAtParsed?: Moment;
        };

        const protocolSlice = [...refractionProtocols];

        return protocolSlice
            .map<SortCompatibleProtocol>((x) => ({
                protocol: x,
                createdAtParsed: moment.utc(x.createdAt),
            }))
            .sort(({ createdAtParsed: leftDate }, { createdAtParsed: rightDate }) => {
                if (!leftDate && !rightDate) {
                    return 0;
                } else if (!leftDate) {
                    return 1;
                } else if (!rightDate) {
                    return -1;
                } else {
                    return rightDate.diff(leftDate);
                }
            })
            .map((x) => x.protocol);
    }, []);

    const currentProtocol = sortedProtocols[0];
    const protocolHistory = sortedProtocols.slice(1);

    const [selectedProtocol, setSelectedProtocol] = React.useState(0);

    return (
        <Container
            fluid
            sx={(theme) => ({ backgroundColor: theme.colors.dark[3], height: "100%" })}
        >
            <Stack>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container
                    size="xl"
                    sx={(_) => ({
                        overflowY: "scroll",
                        height: "calc(100vh - 80px)" /* TODO Proper height here */,
                    })}
                >
                    <Group direction="column" position="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">Max Mustermann</Text>
                    </Group>
                    <RefractionProtocol
                        areActionsAllowed={true}
                        entity={currentProtocol}
                        isSelected={selectedProtocol === 0}
                        onClick={() => setSelectedProtocol(0)}
                    />
                    <Space h="lg" />
                    {protocolHistory.map((oldEntity, index) => (
                        <Stack key={oldEntity.id}>
                            <RefractionProtocol
                                areActionsAllowed={false}
                                entity={oldEntity}
                                isArchived={true}
                                isSelected={index + 1 === selectedProtocol}
                                onClick={() => setSelectedProtocol(index + 1)}
                            />
                            <Space h="sm" />
                        </Stack>
                    ))}
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
