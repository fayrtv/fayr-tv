import { Container, Group, ScrollArea, Stack, Text } from "@mantine/core";
import React from "react";
import { CircleX } from "tabler-icons-react";
import { RefractionProtocol } from "~/components/RefractionProtocol";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "~/components/layout/Layout";
import { GetServerSideProps } from "next";
import { ssrGetUser } from "~/helpers/authentication";
import { DataStore } from "@aws-amplify/datastore";
import { withSSRContext } from "aws-amplify";
import { Moment } from "moment";
import moment from "moment";
import { SerializedModel, serializeModel } from "~/models/amplify-models";
import { RedirectProps, redirectServerSide } from "~/helpers/next-server";
import { useSession } from "../hooks/useSession";
import useBreakpoints from "~/hooks/useBreakpoints";

type ServerProps = {
    refractionProtocols: SerializedModel<RefractionProtocolEntity>[];
};
const SpectaclePassPage: NextPageWithLayout<ServerProps> = ({ refractionProtocols }) => {
    const { isMobile } = useBreakpoints();
    const { user } = useSession();

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
    }, [refractionProtocols]);

    const currentProtocol = sortedProtocols[0];
    const protocolHistory = sortedProtocols.slice(1);

    const [selectedProtocol, setSelectedProtocol] = React.useState(0);

    const userName = `${user?.firstName} ${user?.lastName}`;

    return (
        <Container
            fluid
            sx={{
                height: "100%",
            }}
        >
            <Stack>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container
                    fluid
                    size="xl"
                    sx={(_) => (isMobile ? {} : { marginLeft: "10%", marginRight: "10%" })}
                >
                    <Stack align="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">{userName}</Text>

                        <ScrollArea
                            style={{
                                height: "65vh",
                                overflowX: "hidden",
                            }}
                            type="always"
                        >
                            <Stack>
                                <RefractionProtocol
                                    areActionsAllowed={true}
                                    entity={currentProtocol}
                                    isSelected={selectedProtocol === 0}
                                    onClick={() => setSelectedProtocol(0)}
                                    userName={userName}
                                />
                                {protocolHistory.map((oldEntity, index) => (
                                    <RefractionProtocol
                                        areActionsAllowed={false}
                                        entity={oldEntity}
                                        key={oldEntity.id}
                                        isArchived={true}
                                        isSelected={index + 1 === selectedProtocol}
                                        onClick={() => setSelectedProtocol(index + 1)}
                                        userName={userName}
                                    />
                                ))}
                            </Stack>
                        </ScrollArea>
                    </Stack>
                </Container>
            </Stack>
        </Container>
    );
};

SpectaclePassPage.layoutProps = {
    Layout: Layout,
};

export const getServerSideProps: GetServerSideProps<ServerProps | RedirectProps> = async ({
    req,
    res,
}) => {
    const SSR = withSSRContext({ req });
    const store = SSR.DataStore as typeof DataStore;

    const user = await ssrGetUser(req);
    if (!user) {
        redirectServerSide(res, "/auth/signin");
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
