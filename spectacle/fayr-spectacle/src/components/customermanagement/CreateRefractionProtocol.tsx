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
    Modal,
} from "@mantine/core";
import { Customer } from "../../types/user";
import React from "react";
import { DataStore } from "aws-amplify";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { CirclePlus, DeviceFloppy, Edit, Printer, Trash } from "tabler-icons-react";
import { useForm, useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { RefractionProtocol } from "~/types/refraction-protocol";

type Props = {
    customer: Customer;
};

enum Side {
    Left,
    Right,
}

type PlainProtocol = {
    leftAxis?: number;
    leftCylinder?: number;
    leftPd?: number;
    leftSphere?: number;
    leftAddition?: number;
    rightAxis?: number;
    rightCylinder?: number;
    rightPd?: number;
    rightSphere?: number;
    rightAddition?: number;
};

const defaultProtocol = {
    leftAxis: undefined,
    leftCylinder: undefined,
    leftPd: undefined,
    leftSphere: undefined,
    leftAddition: undefined,
    rightAxis: undefined,
    rightCylinder: undefined,
    rightPd: undefined,
    rightSphere: undefined,
    rightAddition: undefined,
};

type RowProps = {
    form: UseForm<PlainProtocol>;
    side: Side;
};

const RefractionProtocolRow = ({ form, side }: RowProps) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    const sideLiteral = Side[side].toLowerCase();

    return (
        <Grid columns={6}>
            <Grid.Col span={1}>
                <Center sx={(_) => ({ height: "100%" })}>
                    <ColorSwatch color={themedColor} radius={0}>
                        <Text color={theme.colors.primary[7]} size="md" weight="800">
                            {side === Side.Left ? "L" : "R"}
                        </Text>
                    </ColorSwatch>
                </Center>
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput
                    placeholder="Sphäre"
                    required
                    {...form.getInputProps(`${sideLiteral}Sphere` as keyof PlainProtocol)}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput
                    placeholder="Zylinder"
                    required
                    {...form.getInputProps(`${sideLiteral}Cylinder` as keyof PlainProtocol)}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput
                    placeholder="Achse"
                    required
                    {...form.getInputProps(`${sideLiteral}Axis` as keyof PlainProtocol)}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput
                    placeholder="Addition"
                    {...form.getInputProps(`${sideLiteral}Addition` as keyof PlainProtocol)}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <TextInput
                    placeholder="PD"
                    required
                    {...form.getInputProps(`${sideLiteral}Pd` as keyof PlainProtocol)}
                />
            </Grid.Col>
        </Grid>
    );
};

const CreateRefractionProtocol: NextPageWithLayout<Props> = ({ customer }: Props) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;
    const inverseThemedColor = theme.colorScheme === "dark" ? theme.white : theme.black;

    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);

    const [saving, setSaving] = React.useState(false);
    const [showSaveFeedback, setShowSaveFeedback] = React.useState(false);

    const protocolform = useForm<PlainProtocol>({
        initialValues: { ...defaultProtocol },
    });

    const onSubmit = async (protocol: PlainProtocol) => {
        try {
            setSaving(true);
            const jsonProtocolModel: RefractionProtocol = {
                left: {
                    axis: protocol.leftAxis!,
                    cylinder: protocol.leftCylinder!,
                    pd: protocol.leftPd!,
                    sphere: protocol.leftSphere!,
                    addition: protocol.leftAddition,
                },
                right: {
                    axis: protocol.rightAddition!,
                    cylinder: protocol.rightCylinder!,
                    pd: protocol.rightPd!,
                    sphere: protocol.rightSphere!,
                    addition: protocol.rightAddition,
                },
            };

            await DataStore.save(
                new RefractionProtocolEntity({
                    recordedAt: new Date().toISOString(),
                    data: JSON.stringify(jsonProtocolModel),
                    userID: customer.email,
                }),
            );
            setShowSaveFeedback(true);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container>
            <Modal
                opened={showSaveFeedback}
                onClose={() => {
                    setShowSaveFeedback(false);
                    protocolform.reset();
                }}
            >
                <Text>Protokoll erfolgreich gespeichert</Text>
            </Modal>
            <form onSubmit={protocolform.onSubmit(onSubmit)}>
                <Grid columns={6} gutter="xl">
                    <Grid.Col span={3}>
                        <Text color="primary" size="xl" weight="bold">
                            Refraktionsprotokoll anlegen
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={2} offset={1}>
                        <Button size="xs" sx={{ width: "100%" }} leftIcon={<CirclePlus />}>
                            <Text size="xs">Neues Kundenkonto</Text>
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Table horizontalSpacing="xl" sx={(_) => ({ border: "1px solid black" })}>
                            <thead>
                                <tr>
                                    <th>Nachname, Vorname</th>
                                    <th>Status</th>
                                    <th>E-Mail</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={customer.email}>
                                    <td>
                                        {customer.lastName}, {customer.firstName}
                                    </td>
                                    <td>
                                        <Badge size="md" color="transparent" radius="xs">
                                            <Text>
                                                {customer.emailVerified ? "Aktiv" : "Inaktiv"}
                                            </Text>
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
                            <RefractionProtocolRow form={protocolform} side={Side.Left} />
                            <RefractionProtocolRow form={protocolform} side={Side.Right} />
                        </Grid>
                    </Grid.Col>
                    <Grid.Col span={1} sx={(_) => ({ paddingLeft: 0, paddingRight: 0 })}>
                        <Button
                            size="xs"
                            sx={{
                                boxShadow: "0px 0px 3px 0px #000000",
                                width: "100%",
                            }}
                            onClick={protocolform.reset}
                            leftIcon={!isMobile ? <Trash /> : null}
                            color="red"
                        >
                            {!isMobile ? <Text size="xs">Löschen</Text> : <Trash />}
                        </Button>
                    </Grid.Col>
                    <Grid.Col
                        offset={2}
                        span={1}
                        sx={(_) => ({ paddingLeft: "5px", paddingRight: "5px" })}
                    >
                        <Button
                            size="xs"
                            sx={{
                                backgroundColor: themedColor,
                                width: "100%",
                                boxShadow: "0px 0px 3px 0px #000000",
                            }}
                            leftIcon={!isMobile ? <Printer color={inverseThemedColor} /> : null}
                        >
                            {!isMobile ? (
                                <Text color={inverseThemedColor} size="xs">
                                    Drucken
                                </Text>
                            ) : (
                                <Printer color={inverseThemedColor} />
                            )}
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={1} sx={(_) => ({ paddingLeft: "5px", paddingRight: "5px" })}>
                        <Button
                            size="xs"
                            sx={{
                                backgroundColor: themedColor,
                                width: "100%",
                                boxShadow: "0px 0px 3px 0px #000000",
                            }}
                            leftIcon={!isMobile ? <Edit color={inverseThemedColor} /> : null}
                        >
                            {!isMobile ? (
                                <Text color={inverseThemedColor} size="xs">
                                    Bearbeiten
                                </Text>
                            ) : (
                                <Edit color={inverseThemedColor} />
                            )}
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={1} sx={(_) => ({ paddingLeft: "5px", paddingRight: "5px" })}>
                        <Button
                            leftIcon={!isMobile ? <DeviceFloppy /> : null}
                            size="xs"
                            sx={{
                                boxShadow: "0px 0px 3px 0px #000000",
                                width: "100%",
                            }}
                            type="submit"
                            loading={saving}
                        >
                            {!isMobile ? <Text size="xs">Speichern</Text> : <DeviceFloppy />}
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Container>
    );
};

CreateRefractionProtocol.layoutProps = {
    Layout: Layout,
};

export default CreateRefractionProtocol;
