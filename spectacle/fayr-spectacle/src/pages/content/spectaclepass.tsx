import { Container, Group, Space, Stack, Text } from "~/components/common";
import React from "react";
import { CircleX } from "tabler-icons-react";
import { RefractionProtocol } from "~/components/RefractionProtocol";
import RefractionProtocolArchive from "~/components/RefractionProtocolArchive";
import { RefractionProtocol as RefractionProtocolModel } from "~/models/refraction-protocol";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "../../components/layout";

const SpectaclePass: NextPageWithLayout = () => {
    const refractionProtocol: RefractionProtocolModel = {
        date: new Date(),
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

    return (
        <Container fluid sx={(theme) => ({ backgroundColor: theme.colors.red[1], height: "100%" })}>
            <Stack>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container size="xl">
                    <Group direction="column" position="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">Max Mustermann</Text>
                    </Group>
                    <RefractionProtocol
                        areActionsAllowed={false}
                        refractionProtocol={refractionProtocol}
                    />
                    <Space h="lg" />
                    <RefractionProtocolArchive refractionProtocol={refractionProtocol} />
                </Container>
            </Stack>
        </Container>
    );
};

SpectaclePass.layoutProps = {
    Layout: Layout,
};

export default SpectaclePass;
