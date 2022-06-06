import { NextPageWithLayout } from "~/types/next-types";
import Layout from "../layout/Layout";
import { Box, createStyles, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import { Customer } from "~/types/user";
import React from "react";
import { DataStore } from "aws-amplify";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { DeviceFloppy, Edit, Printer, Trash } from "tabler-icons-react";
import { useForm } from "@mantine/hooks";
import { RefractionProtocol } from "~/types/refraction-protocol";
import { RefractionProtocolRow } from "~/components/customermanagement/DataGrid/RefractionProtocolRow";
import { DataGridCell } from "~/components/customermanagement/DataGrid/DataGridCell";
import ResponsiveIconButton from "~/components/ResponsiveIconButton";

type Props = {
    customer: Customer;
};

export enum Side {
    Left,
    Right,
}

export type PlainProtocol = {
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

const useStyles = createStyles((theme) => ({
    dataGrid: {
        display: "grid",
        gap: "5px",
        [`@media(max-width: ${theme.breakpoints.xl}px)`]: {
            gridTemplateRows: "1fr repeat(7, calc(100% / 8))",
            gridTemplateColumns: "1fr 30% 30%",
            gridTemplateAreas: `
            '. LeftSymbol RightSymbol' 
            'SphereHeader LeftSphere RightSphere'
            'CylinderHeader LeftCylinder RightCylinder'
            'AxisHeader LeftAxis RightAxis' 
            'AdditionHeader LeftAddition RightAddition'
            'PdHeader LeftPd RightPd'
            'PrismaHeader LeftPrisma RightPrisma'
            'BasisHeader LeftBasis RightBasis'
        `,
        },
        [`@media(min-width: ${theme.breakpoints.xl}px)`]: {
            gridTemplateColumns: "1fr repeat(7, calc(100% / 8))",
            gridTemplateRows: "1fr 30% 30%",
            gridTemplateAreas: `
            '. SphereHeader CylinderHeader AxisHeader AdditionHeader PdHeader PrismaHeader BasisHeader'
            'LeftSymbol LeftSphere LeftCylinder LeftAxis LeftAddition LeftPd LeftPrisma LeftBasis'
            'RightSymbol RightSphere RightCylinder RightAxis RightAddition RightPd RightPrisma RightBasis'
        `,
        },
    },
}));

const HeaderCell = ({
    area,
    title,
    subtitle,
}: {
    area: string;
    title: string;
    subtitle: string;
}) => {
    return (
        <DataGridCell area={area}>
            <Stack align="center" spacing="xs">
                <Text>{title}</Text>
                <Text size="xxs">{subtitle}</Text>
            </Stack>
        </DataGridCell>
    );
};

const CreateRefractionProtocol: NextPageWithLayout<Props> = ({ customer }: Props) => {
    const { classes } = useStyles();

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
        <Box>
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
                    <Stack spacing="lg">
                        <div className={classes.dataGrid}>
                            <HeaderCell area="SphereHeader" title="Sphäre" subtitle="S / SPH" />
                            <HeaderCell
                                area="CylinderHeader"
                                title="Zylinder"
                                subtitle="ZYL / CYL"
                            />
                            <HeaderCell area="AxisHeader" title="Achse" subtitle="A / ACH" />
                            <HeaderCell area="AdditionHeader" title="Addition" subtitle="ADD" />
                            <HeaderCell area="PdHeader" title="PD" subtitle="PD" />
                            <HeaderCell area="PrismaHeader" title="Prisma" subtitle="PR" />
                            <HeaderCell area="BasisHeader" title="Basis" subtitle="BA" />

                            <RefractionProtocolRow form={protocolForm} side={Side.Left} />
                            <RefractionProtocolRow form={protocolForm} side={Side.Right} />
                        </div>
                        <Group grow>
                            <Group>
                                <ResponsiveIconButton
                                    size="xs"
                                    color="danger"
                                    onClick={protocolForm.reset}
                                    leftIcon={<Trash />}
                                >
                                    Löschen
                                </ResponsiveIconButton>
                            </Group>
                            <Group noWrap spacing="sm" sx={{ justifyContent: "right" }}>
                                <ResponsiveIconButton
                                    size="xs"
                                    variant="light"
                                    color="gray"
                                    onClick={() => window.print()}
                                    leftIcon={<Printer />}
                                >
                                    Drucken
                                </ResponsiveIconButton>
                                <ResponsiveIconButton
                                    size="xs"
                                    variant="light"
                                    color="gray"
                                    leftIcon={<Edit />}
                                >
                                    Bearbeiten
                                </ResponsiveIconButton>

                                <ResponsiveIconButton
                                    size="xs"
                                    variant="filled"
                                    color="primary"
                                    leftIcon={<DeviceFloppy />}
                                    loading={saving}
                                >
                                    Speichern
                                </ResponsiveIconButton>
                            </Group>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

CreateRefractionProtocol.layoutProps = {
    Layout: Layout,
};

export default CreateRefractionProtocol;
