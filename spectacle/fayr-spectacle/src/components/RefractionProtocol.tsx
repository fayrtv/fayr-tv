import { Badge, Button, Container, Group, Space, Text, Grid, useMantineTheme } from "@mantine/core";
import React from "react";
import { Edit, Eye, Printer, Qrcode } from "tabler-icons-react";

export const RefractionProtocol = () => {
    const theme = useMantineTheme();
    const [areButtonsEnabled, setAreButtonsEnabled] = React.useState(true);

    return (
        <Group spacing="xs" sx={(_) => ({ background: "#4498D8" })} direction="column">
            <Container mt="xs">
                <Group direction="row" position="center" noWrap>
                    <Eye
                        size={50}
                        style={{
                            backgroundColor: theme.white,
                            color: "#4498D8",
                            borderRadius: "10px",
                        }}
                    />
                    <Text color={theme.white} size="xs">
                        REFRAKTIONSPROTOKOLL
                    </Text>
                    <Group direction="column" align="end" spacing="xs">
                        <Badge
                            size="md"
                            color="transparent"
                            radius="xs"
                            style={{ backgroundColor: theme.white }}
                        >
                            Aktuell
                        </Badge>
                        <Text size="xs" color={theme.white}>
                            28.04.2018
                        </Text>
                    </Group>
                </Group>
            </Container>
            <Space
                sx={(theme) => ({
                    borderBottom: `1px solid ${theme.white}`,
                    width: "100%",
                })}
            />
            <Container>
                <Grid columns={11}>
                    <Grid.Col span={2} offset={1}>
                        <Group align="center" direction="column" sx={(theme) => ({ gap: 0 })}>
                            <Text size="sm" color="" weight="bold">
                                Sphäre
                            </Text>
                            <Text sx={(theme) => ({ fontSize: "10px" })}>S / SPH</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Group align="center" direction="column" sx={(theme) => ({ gap: 0 })}>
                            <Text size="sm" color="" weight="bold">
                                Zylinder
                            </Text>
                            <Text sx={(theme) => ({ fontSize: "9px" })}>ZYL / CYL</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={2}>Achse</Grid.Col>
                    <Grid.Col span={2}>Addition</Grid.Col>
                    <Grid.Col span={2}>PD</Grid.Col>

                    <Grid.Col span={1}>R</Grid.Col>
                    <Grid.Col span={2}>-2,50</Grid.Col>
                    <Grid.Col span={2}>-0,25</Grid.Col>
                    <Grid.Col span={2}>170,00°</Grid.Col>
                    <Grid.Col span={2}>-</Grid.Col>
                    <Grid.Col span={2}>35,00</Grid.Col>

                    <Grid.Col span={1}>L</Grid.Col>
                    <Grid.Col span={2}>-1,75</Grid.Col>
                    <Grid.Col span={2}>-0,75</Grid.Col>
                    <Grid.Col span={2}>168,00°</Grid.Col>
                    <Grid.Col span={2}>-</Grid.Col>
                    <Grid.Col span={2}>34,50</Grid.Col>
                </Grid>
            </Container>
            <Space sx={(_) => ({ borderBottom: `1px solid ${theme.white}`, width: "100%" })} />
            <Container fluid sx={(theme) => ({ margin: "auto 0", width: "100%" })}>
                <Group direction="row" position="apart">
                    <Printer
                        size={"30px"}
                        style={{
                            backgroundColor: theme.white,
                            color: "#4498D8",
                            borderRadius: "5px",
                            padding: "2px",
                        }}
                    />
                    <Group direction="row">
                        <Button
                            size="sm"
                            disabled={!areButtonsEnabled}
                            sx={(theme) => ({
                                backgroundColor: theme.white,
                                padding: "5px",
                            })}
                            leftIcon={<Qrcode color="#4498D8" />}
                        >
                            <Text size="xs" color="#4498D8">
                                QR-Code
                            </Text>
                        </Button>
                        <Button
                            disabled={!areButtonsEnabled}
                            sx={(theme) => ({
                                backgroundColor: theme.white,
                                padding: "5px",
                            })}
                            leftIcon={<Edit color="#4498D8" />}
                        >
                            <Text size="xs" color="#4498D8">
                                Bearbeiten
                            </Text>
                        </Button>
                    </Group>
                </Group>
            </Container>
            <Space />
        </Group>
    );
};
