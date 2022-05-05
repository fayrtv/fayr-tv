import { Badge, Button, Container, Group, Space, Text, useMantineTheme } from "@mantine/core";
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
                <Group direction="row">
                    <Text>Blub</Text>
                </Group>
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
