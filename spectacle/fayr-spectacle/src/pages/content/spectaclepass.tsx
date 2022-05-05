import { Container, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { CircleX } from "tabler-icons-react";
import { RefractionProtocol } from "~/components/RefractionProtocol";
import { NextPageWithLayout } from "~/types/next-types";

import Layout from "../../components/layout";

const SpectaclePass: NextPageWithLayout = () => {
    return (
        <Container fluid sx={(theme) => ({ backgroundColor: "#6C6C6C", height: "100%" })}>
            <Stack>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container size="xl">
                    <Group direction="column" position="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">Max Mustermann</Text>
                    </Group>
                    <RefractionProtocol />
                </Container>
            </Stack>
        </Container>
    );
};

SpectaclePass.layoutProps = {
    Layout: Layout,
};

export default SpectaclePass;
