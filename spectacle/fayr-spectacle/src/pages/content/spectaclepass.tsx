import Layout from "../../components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { CircleX, Eye, Printer } from "tabler-icons-react";
import { Group, Container, Text, Space, Badge } from "@mantine/core";

const SpectaclePass: NextPageWithLayout = () => {
    return (
        <Container fluid>
            <Group direction="column" grow>
                <Group direction="row" position="right">
                    <CircleX size={30} />
                </Group>
                <Container>
                    <Group direction="column" position="center" spacing="xs">
                        <Text weight="bold">Digitaler Brillenpass</Text>
                        <Text weight="normal">Max Mustermann</Text>
                    </Group>
                </Container>
                <Group spacing="xs" sx={(_) => ({ background: "#4498D8" })} direction="column">
                    <Space />
                    <Container>
                        <Group direction="row" position="center" noWrap>
                            <Eye
                                size={50}
                                style={{
                                    backgroundColor: "white",
                                    color: "#4498D8",
                                    borderRadius: "10px",
                                }}
                            />
                            <Text color="white" size="xs">
                                REFRAKTIONSPROTOKOLL
                            </Text>
                            <Group direction="column" align="end" spacing="xs">
                                <Badge size="md" color="black" radius="xs">
                                    Aktuell
                                </Badge>
                                <Text size="xs" color="white">
                                    28.04.2018
                                </Text>
                            </Group>
                        </Group>
                    </Container>
                    <Space sx={(_) => ({ borderBottom: "1px solid white", width: "100%" })} />
                    <Container>
                        <Group direction="row">
                            <Text>Blub</Text>
                        </Group>
                    </Container>
                    <Space sx={(_) => ({ borderBottom: "1px solid white", width: "100%" })} />
                    <Container fluid>
                        <Group direction="row" position="apart">
                            <Printer />
                        </Group>
                    </Container>
                    <Space />
                </Group>
            </Group>
        </Container>
    );
};

SpectaclePass.layoutProps = {
    Layout: Layout,
};

export default SpectaclePass;
