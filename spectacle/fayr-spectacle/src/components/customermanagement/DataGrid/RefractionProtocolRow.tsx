import { Center, ColorSwatch, NumberInput, Text, TextInput, useMantineTheme } from "@mantine/core";
import React from "react";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { PlainProtocol, Side } from "~/components/customermanagement/CreateRefractionProtocol";
import { DataGridCell } from "~/components/customermanagement/DataGrid/DataGridCell";
import useBreakpoints from "~/hooks/useBreakpoints";

type RowProps = {
    form: UseForm<PlainProtocol>;
    side: Side;
};

export const RefractionProtocolRow = ({ form, side }: RowProps) => {
    const theme = useMantineTheme();

    const { isMobile } = useBreakpoints();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    const sideIdentifier = Side[side].toLowerCase();
    const sideCaption = side === Side.Left ? "links" : "rechts";

    const createCaption = (propertyName: string) =>
        isMobile ? propertyName : `${propertyName} ${sideCaption}`;

    return (
        <>
            <DataGridCell area={`${Side[side]}Symbol`}>
                <Center sx={(_) => ({ height: "100%" })}>
                    <ColorSwatch color={themedColor} radius={0}>
                        <Text color={theme.colors.primary[6]} size="md" weight="800">
                            {side === Side.Left ? "L" : "R"}
                        </Text>
                    </ColorSwatch>
                </Center>
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Sphere`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Sphäre")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Sphere` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Cylinder`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Zylinder")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Cylinder` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Axis`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Achse")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Axis` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Addition`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Addition")}
                    {...form.getInputProps(`${sideIdentifier}Addition` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Pd`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("PD")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Pd` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Prisma`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Prisma")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Prisma` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Basis`}>
                <NumberInput
                    precision={2}
                    step={0.25}
                    placeholder={createCaption("Basis")}
                    required
                    {...form.getInputProps(`${sideIdentifier}Basis` as keyof PlainProtocol)}
                />
            </DataGridCell>
        </>
    );
};
