import { Center, ColorSwatch, Text, TextInput, useMantineTheme } from "@mantine/core";
import React from "react";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { PlainProtocol, Side } from "~/components/customermanagement/CreateRefractionProtocol";
import { DataGridCell } from "~/components/customermanagement/DataGrid/DataGridCell";

type RowProps = {
    form: UseForm<PlainProtocol>;
    side: Side;
};

export const RefractionProtocolRow = ({ form, side }: RowProps) => {
    const theme = useMantineTheme();
    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    const sideIdentifier = Side[side].toLowerCase();
    const sideCaption = side === Side.Left ? "links" : "rechts";

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
            <DataGridCell area={`${Side[side]}Prisma`}>
                <TextInput
                    placeholder={`Prisma ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Prisma` as keyof PlainProtocol)}
                />
            </DataGridCell>
            <DataGridCell area={`${Side[side]}Basis`}>
                <TextInput
                    placeholder={`Basis ${sideCaption}`}
                    required
                    {...form.getInputProps(`${sideIdentifier}Basis` as keyof PlainProtocol)}
                />
            </DataGridCell>
        </>
    );
};
