import {
    Badge,
    Button,
    ColorSwatch,
    Container,
    Grid,
    Group,
    Space,
    Stack,
    Text,
} from "~/components/common";
import moment from "moment";
import React, { PropsWithChildren } from "react";
import { Eye, Printer, Qrcode } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/models/refraction-protocol";
import { useMantineTheme } from "@mantine/core";

const GridText = (
    props: PropsWithChildren<
        Omit<React.ComponentPropsWithoutRef<typeof Text>, "size" | "align" | "weight">
    >,
) => (
    <Text
        {...props}
        size="sm"
        align="center"
        weight="bold"
        sx={(theme) => ({
            color: theme.colorScheme === "light" ? theme.white : theme.black,
            userSelect: "all",
        })}
    >
        {props.children}
    </Text>
);

type Props = {
    areActionsAllowed: boolean;
    entity: RefractionProtocolEntity;
};

export const RefractionProtocol = ({ areActionsAllowed, entity }: Props) => {
    const theme = useMantineTheme();

    const refractionProtocol = entity.data as unknown as RefractionProtocolModel;

    const themedColor = theme.colorScheme === "light" ? theme.white : theme.black;

    const createGridHeading = (heading: string, shortDescription: string): React.ReactNode => (
        <Group align="center" direction="column" sx={(_) => ({ gap: 0 })}>
            <Text size="sm" color={themedColor} weight="bold">
                {heading}
            </Text>
            <Text size="xxxs" color={themedColor}>
                {shortDescription}
            </Text>
        </Group>
    );

    const createRefractionProtocolSide = (side: "L" | "R") => {
        const sideConfiguration = side === "L" ? refractionProtocol.left : refractionProtocol.right;

        return (
            <>
                <Grid.Col span={1}>
                    <ColorSwatch color={themedColor} radius={5}>
                        <Text color={theme.colors.cyan[0]} size="md" weight="800">
                            {side}
                        </Text>
                    </ColorSwatch>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText>{sideConfiguration.sphere}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText>{sideConfiguration.cylinder}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText>{sideConfiguration.axis}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText>{sideConfiguration.addition ?? "-"}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText>{sideConfiguration.pd}</GridText>
                </Grid.Col>
            </>
        );
    };

    return (
        <Stack spacing="xs" sx={(_) => ({ background: theme.colors.cyan[0] })}>
            <Container mt="xs">
                <Group direction="row" position="center" noWrap>
                    <Eye
                        size={40}
                        style={{
                            backgroundColor: theme.white,
                            color: theme.colors.cyan[0],
                            borderRadius: "10px",
                        }}
                    />
                    <Text color={theme.white} size="xxs" transform="uppercase">
                        Refraktionsprotokoll
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
                            {moment(entity.recordedAt).format("DD.MM.YYYY")}
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
            <Grid columns={11} sx={(_) => ({ margin: "auto 5px" })}>
                <Grid.Col span={2} offset={1}>
                    {createGridHeading("Sphäre", "S / SPH")}
                </Grid.Col>
                <Grid.Col span={2}>{createGridHeading("Zylinder", "ZYL / CYL")}</Grid.Col>
                <Grid.Col span={2}>{createGridHeading("Achse", "A / ACH")}</Grid.Col>
                <Grid.Col span={2}>{createGridHeading("Addition", "ADD")}</Grid.Col>
                <Grid.Col span={2}>{createGridHeading("PD", "PD")}</Grid.Col>

                {createRefractionProtocolSide("R")}
                {createRefractionProtocolSide("L")}
            </Grid>
            <Space sx={(_) => ({ borderBottom: `1px solid ${theme.white}`, width: "100%" })} />
            <Container fluid sx={(_) => ({ margin: "auto 0", width: "100%" })}>
                <Group direction="row" position="apart">
                    <Printer
                        size={30}
                        style={{
                            backgroundColor:
                                theme.colorScheme === "dark" ? theme.black : theme.white,
                            color: theme.colors.cyan[0],
                            borderRadius: "5px",
                            padding: "2px",
                        }}
                    />
                    <Button
                        size="sm"
                        disabled={!areActionsAllowed}
                        sx={{ padding: "5px" }}
                        leftIcon={<Qrcode color={theme.colors.cyan[0]} />}
                    >
                        <Text size="xs" color={theme.colors.cyan[0]}>
                            QR-Code
                        </Text>
                    </Button>
                </Group>
            </Container>
            <Space />
        </Stack>
    );
};
