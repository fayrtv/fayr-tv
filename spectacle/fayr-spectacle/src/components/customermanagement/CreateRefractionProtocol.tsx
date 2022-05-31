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
    Paper,
    Group,
} from "@mantine/core";
import { Customer } from "../../types/user";
import React from "react";
import { DataStore } from "aws-amplify";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { DeviceFloppy, Edit, Printer, Trash } from "tabler-icons-react";
import { useForm } from "@mantine/hooks";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { RefractionProtocol } from "~/types/refraction-protocol";
import useIsMobile from "~/hooks/useIsMobile";

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

const DataGridCell = ({ children, area }: { children: React.ReactNode; area: string }) => (
    <div style={{ height: "100%", width: "100%", gridArea: area }}>{children}</div>
);

const RefractionProtocolRow = ({ form, side }: RowProps) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    const sideIdentifier = Side[side].toLowerCase();
    const sideCaption = side === Side.Left ? "links" : "rechts";

    return (
        <>
            <DataGridCell area={`${Side[side]}Symbol`}>
                <Center sx={(_) => ({ height: "100%" })}>
                    <ColorSwatch color={themedColor} radius={0}>
                        <Text color={theme.colors.primary[7]} size="md" weight="800">
                            {side === Side.Left ? "L" : "R"}
                        </Text>
                    </ColorSwatch>
                </Center>
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Sphere`}>
                <TextInput
                    placeholder={`Sphäre ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Sphere` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Cylinder`}>
                <TextInput
                    placeholder={`Zylinder ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Cylinder` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Axis`}>
                <TextInput
                    placeholder={`Achse ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Axis` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Addition`}>
                <TextInput
                    placeholder={`Addition ${sideCaption}`}
                    {...form.getInputProps(`${sideIdentifier}Addition` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Pd`}>
                <TextInput
                    placeholder={`PD ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Pd` as keyof PlainProtocol)}
                />
            </DataGridCell>
        </>
    );
};

const CreateRefractionProtocol: NextPageWithLayout<Props> = ({ customer }: Props) => {
    const theme = useMantineTheme();
    const inverseThemedColor = theme.colorScheme === "dark" ? theme.white : theme.black;

    const isMobile = useIsMobile();

    const [saving, setSaving] = React.useState(false);
    const [showSaveFeedback, setShowSaveFeedback] = React.useState(false);

    const protocolForm = useForm<PlainProtocol>({
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
        <Container fluid>
            <Modal
                opened={showSaveFeedback}
                onClose={() => {
                    setShowSaveFeedback(false);
                    protocolForm.reset();
                }}
            >
                <Text>Protokoll erfolgreich gespeichert</Text>
            </Modal>
            <Paper>
                <form onSubmit={protocolForm.onSubmit(onSubmit)}>
                    <Grid columns={6} gutter="lg">
                        <Grid.Col span={6}>
                            <div
                                style={
                                    isMobile
                                        ? {
                                              display: "grid",
                                              gridTemplateAreas: `
										'. RightSymbol LeftSymbol' 
										'SphereHeader RightSphere LeftSphere'
										'CylinderHeader RightCylinder LeftCylinder'
										'AxisHeader RightAxis LeftAxis' 
										'AdditionHeader RightAddition LeftAddition'
										'Pdheader RightPd LeftPd'
									`,
                                              gridTemplateRows: "repeat(6, 16.66%)",
                                              gridTemplateColumns: "40% 30% 30%",
                                              gap: "5px",
                                          }
                                        : {
                                              display: "grid",
                                              gridTemplateAreas: `
										'. SphereHeader CylinderHeader AxisHeader AdditionHeader Pdheader' 
										'RightSymbol RightSphere RightCylinder RightAxis RightAddition RightPd'
										'LeftSymbol LeftSphere LeftCylinder LeftAxis LeftAddition LeftPd'
									`,
                                              gridTemplateColumns: "repeat(6, 16.66%)",
                                              gridTemplateRows: "40% 30% 30%",
                                              gap: "5px",
                                          }
                                }
                            >
                                <DataGridCell area="SphereHeader">
                                    <Stack align="center" spacing="xs">
                                        <Text>Sphäre</Text>
                                        <Text size="xs">S / SPH</Text>
                                    </Stack>
                                </DataGridCell>
                                <DataGridCell area="CylinderHeader">
                                    <Stack align="center" spacing="xs">
                                        <Text>Zylinder</Text>
                                        <Text size="xs">ZYL / CYL</Text>
                                    </Stack>
                                </DataGridCell>
                                <DataGridCell area="AxisHeader">
                                    <Stack align="center" spacing="xs">
                                        <Text>Achse</Text>
                                        <Text size="xs">A / ACH</Text>
                                    </Stack>
                                </DataGridCell>
                                <DataGridCell area="AdditionHeader">
                                    <Stack align="center" spacing="xs">
                                        <Text>Addition</Text>
                                        <Text size="xs">ADD</Text>
                                    </Stack>
                                </DataGridCell>
                                <DataGridCell area="Pdheader">
                                    <Stack align="center" spacing="xs">
                                        <Text>PD</Text>
                                        <Text size="xs">PD</Text>
                                    </Stack>
                                </DataGridCell>
                                <RefractionProtocolRow form={protocolForm} side={Side.Left} />
                                <RefractionProtocolRow form={protocolForm} side={Side.Right} />
                            </div>
                        </Grid.Col>
                        <Grid.Col span={1} sx={(_) => ({ paddingLeft: 0, paddingRight: 0 })}>
                            <Button
                                size="xs"
                                onClick={protocolForm.reset}
                                leftIcon={!isMobile ? <Trash /> : null}
                                color="danger"
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
                                    width: "100%",
                                }}
                                variant="default"
                                leftIcon={!isMobile ? <Printer color={inverseThemedColor} /> : null}
                                onClick={() => window.print()}
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
                        <Grid.Col
                            span={1}
                            sx={(_) => ({ paddingLeft: "5px", paddingRight: "5px" })}
                        >
                            <Button
                                size="xs"
                                sx={{
                                    width: "100%",
                                }}
                                variant="default"
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
                        <Grid.Col
                            span={1}
                            sx={(_) => ({ paddingLeft: "5px", paddingRight: "5px" })}
                        >
                            <Button
                                leftIcon={!isMobile ? <DeviceFloppy /> : null}
                                size="xs"
                                sx={{
                                    width: "100%",
                                }}
                                type="submit"
                                loading={saving}
                            >
                                {!isMobile ? "Speichern" : <DeviceFloppy />}
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

CreateRefractionProtocol.layoutProps = {
    Layout: Layout,
};

export default CreateRefractionProtocol;
