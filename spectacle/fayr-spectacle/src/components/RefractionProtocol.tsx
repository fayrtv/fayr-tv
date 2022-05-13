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
    Modal,
} from "~/components/common";
import moment from "moment";
import React, { PropsWithChildren, useState } from "react";
import { Eye, Printer, Qrcode } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { useMantineTheme } from "@mantine/core";
import { RefractionProtocolQRCode } from "~/components/QRCode";

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
    isSelected: boolean;
    isArchived?: boolean;
    onClick: () => void;
};

const BackgroundGrey = "#A8A8A8";

export const RefractionProtocol = ({
    areActionsAllowed,
    entity,
    isSelected,
    isArchived = false,
    onClick,
}: Props) => {
    const theme = useMantineTheme();

    const [qrCodeOpen, setQRCodeOpen] = useState(false);

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
                        <Text color={theme.colors.primary[7]} size="md" weight="800">
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
        <Stack
            spacing="xs"
            sx={(_) => ({ background: isArchived ? BackgroundGrey : theme.colors.primary[7] })}
        >
            <Container mt="xs" onClick={onClick} sx={(_) => ({ padding: 0 })}>
                <Group direction="row" position="center" noWrap>
                    <Eye
                        size={40}
                        style={{
                            backgroundColor: theme.white,
                            color: theme.colors.primary[7],
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
                            <Text color={theme.colorScheme === "dark" ? theme.black : theme.white}>
                                {isArchived ? "Archiv" : "Aktuell"}
                            </Text>
                        </Badge>
                        <Text size="xs" color={theme.white}>
                            {moment(entity.recordedAt).format("DD.MM.YYYY")}
                        </Text>
                    </Group>
                </Group>
            </Container>
            {isSelected && (
                <>
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
                    <Space
                        sx={(_) => ({ borderBottom: `1px solid ${theme.white}`, width: "100%" })}
                    />
                    <Container fluid sx={(_) => ({ margin: "auto 0", width: "100%" })}>
                        <Group direction="row" position="apart">
                            <Printer
                                size={30}
                                style={{
                                    backgroundColor:
                                        theme.colorScheme === "dark" ? theme.black : theme.white,
                                    color: theme.colors.primary[7],
                                    borderRadius: "5px",
                                    padding: "2px",
                                }}
                                onClick={() => window.print()}
                            />
                            <Modal
                                opened={qrCodeOpen}
                                onClose={() => setQRCodeOpen(false)}
                                title="Ihr Refraktionsprotokoll"
                            >
                                <RefractionProtocolQRCode refractionProtocol={entity} />
                            </Modal>
                            <Button
                                size="sm"
                                disabled={!areActionsAllowed}
                                sx={{ padding: "5px" }}
                                leftIcon={<Qrcode color={theme.colors.dark[7]} />}
                                onClick={() => setQRCodeOpen(true)}
                            >
                                <Text size="xs" color={theme.colors.dark[7]}>
                                    QR-Code
                                </Text>
                            </Button>
                        </Group>
                    </Container>
                </>
            )}
            <Space />
        </Stack>
    );
};
