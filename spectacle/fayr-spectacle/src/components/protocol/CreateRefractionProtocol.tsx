import { NextPageWithLayout } from "../../types/next-types";
import Layout from "../layout/Layout";
import {
    Button,
    Container,
    ColorSwatch,
    Center,
    Grid,
    Table,
    Text,
    Badge,
    Stack,
    TextInput,
    useMantineTheme,
} from "@mantine/core";
import { Customer } from "../../types/user";
import React from "react";
import { RefractionProtocol } from "~/types/refraction-protocol";
import { CirclePlus, DeviceFloppy, Edit, Printer, Trash } from "tabler-icons-react";

type Props = {
    customer: Customer;
};

enum Side {
    Left,
    Right,
}

const RefractionProtocolRow = ({ side }: { side: Side }) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    return (
        <Grid columns={6}>
            <Grid.Col span={1}>
                <Center sx={(_) => ({ height: "100%" })}>
                    <ColorSwatch color={themedColor} radius={5}>
                        <Text color={theme.colors.primary[7]} size="md" weight="800">
                            {side === Side.Left ? "L" : "R"}
                        </Text>
                    </ColorSwatch>
                </Center>
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput placeholder="Sphäre" />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput placeholder="Zylinder" />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput placeholder="Achse" />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput placeholder="Addition" />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput placeholder="PD" />
            </Grid.Col>
        </Grid>
    );
};

const CreateRefractionProtocol: NextPageWithLayout<Props> = ({ customer }: Props) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;
    const inverseThemedColor = theme.colorScheme === "dark" ? theme.white : theme.black;

    const [protocol, setProtocol] = React.useState<RefractionProtocol>({} as RefractionProtocol);

    return (
        <Container>
            <Grid columns={6} gutter="md">
                <Grid.Col span={3}>
                    <Text color="primary" size="xl" weight="bold">
                        Refraktionsprotokoll anlegen
                    </Text>
                </Grid.Col>
                <Grid.Col span={1} offset={2}>
                    <Button size="xs" sx={{ width: "100%" }} leftIcon={<CirclePlus />}>
                        <Text size="xs">Neues Kundenkonto</Text>
                    </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Table horizontalSpacing="xl" sx={(_) => ({ border: "1px solid black" })}>
                        <thead>
                            <tr>
                                <th>Nachname</th>
                                <th>Vorname</th>
                                <th>Status</th>
                                <th>E-Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={customer.email}>
                                <td>{customer.lastName}</td>
                                <td>{customer.firstName}</td>
                                <td>
                                    <Badge size="md" color="transparent" radius="xs">
                                        <Text>{customer.emailVerified ? "Aktiv" : "Inaktiv"}</Text>
                                    </Badge>
                                </td>
                                <td>{customer.email}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Grid columns={6}>
                        <Grid.Col offset={1} span={1}>
                            <Stack align="center" spacing="xs">
                                <Text>Sphäre</Text>
                                <Text>S / SPH</Text>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Stack align="center" spacing="xs">
                                <Text>Zylinder</Text>
                                <Text>ZYL / CYL</Text>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Stack align="center" spacing="xs">
                                <Text>Achse</Text>
                                <Text>A / ACH</Text>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Stack align="center" spacing="xs">
                                <Text>Addition</Text>
                                <Text>ADD</Text>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Stack align="center" spacing="xs">
                                <Text>PD</Text>
                                <Text>PD</Text>
                            </Stack>
                        </Grid.Col>
                        <RefractionProtocolRow side={Side.Left} />
                        <RefractionProtocolRow side={Side.Right} />
                        <Grid.Col span={1}>
                            <Button
                                size="xs"
                                sx={{ width: "100%" }}
                                leftIcon={<Trash />}
                                color="red"
                            >
                                <Text size="xs">Löschen</Text>
                            </Button>
                        </Grid.Col>
                        <Grid.Col offset={2} span={1}>
                            <Button
                                size="xs"
                                sx={{
                                    backgroundColor: themedColor,
                                    width: "100%",
                                    boxShadow: "0px 0px 3px 0px #000000",
                                }}
                                leftIcon={<Printer color={inverseThemedColor} />}
                            >
                                <Text color={inverseThemedColor} size="xs">
                                    Drucken
                                </Text>
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Button
                                size="xs"
                                sx={{
                                    backgroundColor: themedColor,
                                    width: "100%",
                                    boxShadow: "0px 0px 3px 0px #000000",
                                }}
                                leftIcon={<Edit color={inverseThemedColor} />}
                            >
                                <Text color={inverseThemedColor} size="xs">
                                    Bearbeiten
                                </Text>
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Button size="xs" sx={{ width: "100%" }} leftIcon={<DeviceFloppy />}>
                                <Text size="xs">Speichenr</Text>
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

CreateRefractionProtocol.layoutProps = {
    Layout: Layout,
};

export default CreateRefractionProtocol;
