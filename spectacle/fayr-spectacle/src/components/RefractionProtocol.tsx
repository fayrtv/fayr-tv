import {
    Badge,
    Button,
    Center,
    ColorSwatch,
    Container,
    Divider,
    Grid,
    Group,
    Modal,
    Paper,
    Space,
    Stack,
    Sx,
    Text,
    useMantineTheme,
} from "@mantine/core";
import moment from "moment";
import React, { PropsWithChildren, useState } from "react";
import { Eye, Printer, Qrcode } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { RefractionProtocolQRCode } from "~/components/QRCode";
import useIsMobile from "../hooks/useIsMobile";

const GridText = (
    props: PropsWithChildren<
        Omit<React.ComponentPropsWithoutRef<typeof Text>, "size" | "align" | "weight"> & {
            isDarkMode: boolean;
        }
    >,
) => (
    <Text
        {...props}
        size="sm"
        align="center"
        weight="bold"
        sx={(theme) => ({
            color: props.isDarkMode ? theme.black : theme.white,
            userSelect: "all",
        })}
    >
        {props.children}
    </Text>
);

type Props = {
    areActionsAllowed: boolean;
    entity: RefractionProtocolEntity;
    userName: string;
    isSelected: boolean;
    isArchived?: boolean;
    onClick: () => void;
};

const BackgroundGrey = "#A8A8A8";

export const RefractionProtocol = ({
    areActionsAllowed,
    entity,
    userName,
    isSelected,
    isArchived = false,
    onClick,
}: Props) => {
    const theme = useMantineTheme();

    const isMobile = useIsMobile();

    const [qrCodeOpen, setQRCodeOpen] = useState(false);

    const refractionProtocol = entity.data as unknown as RefractionProtocolModel;

    const isDarkMode = theme.colorScheme === "dark";
    const themedColor = isDarkMode ? theme.black : theme.white;

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

    const createRefractionProtocolSide = (side: "L" | "R", isSlimView: boolean) => {
        const sideConfiguration = side === "L" ? refractionProtocol.left : refractionProtocol.right;

        const backgroundSx: Sx = (_) => ({
            backgroundColor: isSlimView
                ? "auto"
                : side === "L"
                ? "rgb(217, 217, 217, 0.25)"
                : "auto",
        });

        return (
            <>
                <Grid.Col span={1}>
                    <ColorSwatch color={themedColor} radius={5}>
                        <Text color={theme.colors.primary[6]} size="md" weight="800">
                            {side}
                        </Text>
                    </ColorSwatch>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.sphere}</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.cylinder}</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.axis}°</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.addition ?? "-"}</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.pd}</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.prisma ?? "-"}</GridText>
                </Grid.Col>
                <Grid.Col span={2} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.basis ?? "-"}</GridText>
                </Grid.Col>
            </>
        );
    };

    const actionItemStyleProps = {
        size: 30,
        style: {
            color: theme.colors.primary[6],
            borderRadius: "5px",
            padding: "2px",
        },
    };

    if (!isSelected) {
        return (
            <Paper
                onClick={onClick}
                p="sm"
                sx={(_) => ({
                    background: isArchived ? BackgroundGrey : theme.colors.primary[7],
                })}
            >
                <Group direction="row" position="apart">
                    <Group direction="row">
                        <Eye
                            size={40}
                            style={{
                                backgroundColor: themedColor,
                                color: theme.colors.primary[7],
                                borderRadius: "10px",
                            }}
                        />
                        <Text color={themedColor} size="xs" transform="uppercase">
                            Refraktionsprotokoll
                        </Text>
                    </Group>
                    <Group direction="column" align="end" spacing="xs">
                        <Badge
                            size="md"
                            color="transparent"
                            radius="xs"
                            style={{ backgroundColor: themedColor }}
                        >
                            <Text color={theme.colors.primary[isDarkMode ? 0 : 5]}>
                                {isArchived ? "Archiv" : "Aktuell"}
                            </Text>
                        </Badge>
                        <Text size="xs" color={themedColor}>
                            {moment(entity.recordedAt).format("DD.MM.YYYY")}
                        </Text>
                    </Group>
                </Group>
            </Paper>
        );
    }

    const renderQrCode = () => <RefractionProtocolQRCode refractionProtocol={entity} />;

    return (
        <Paper
            onClick={onClick}
            p="md"
            sx={(_) => ({
                background: isArchived ? BackgroundGrey : theme.colors.primary[7],
            })}
        >
            <Group direction="row">
                <Stack
                    spacing="xs"
                    sx={(theme) => ({
                        flexGrow: 2,
                        borderRight: `2px solid ${themedColor}`,
                    })}
                >
                    <Text color={themedColor} weight={700} size="xs" transform="uppercase">
                        Refraktionsprotokoll
                    </Text>
                    <Text color={themedColor} size="xs">
                        {userName}
                    </Text>
                    <Center>{renderQrCode()}</Center>
                </Stack>
                <Stack spacing="xs" onClick={onClick} sx={(_) => ({ flexGrow: 3 })}>
                    <Grid columns={15} sx={(_) => ({ margin: "auto 5px" })}>
                        <Grid.Col span={2} offset={1}>
                            {createGridHeading("Sphäre", "S / SPH")}
                        </Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("Zylinder", "ZYL / CYL")}</Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("Achse", "A / ACH")}</Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("Addition", "ADD")}</Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("PD", "PD")}</Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("Prisma", "PR")}</Grid.Col>
                        <Grid.Col span={2}>{createGridHeading("Basis", "BA")}</Grid.Col>

                        {createRefractionProtocolSide("L", isMobile)}
                        {createRefractionProtocolSide("R", isMobile)}
                    </Grid>
                    {isMobile ? (
                        <Container fluid sx={(_) => ({ margin: "auto 0", width: "100%" })}>
                            <Group direction="row" position="left">
                                <Printer
                                    {...actionItemStyleProps}
                                    onClick={() => areActionsAllowed && window.print()}
                                />
                                <Qrcode
                                    {...actionItemStyleProps}
                                    onClick={() => areActionsAllowed && setQRCodeOpen(true)}
                                />
                                <Modal
                                    opened={qrCodeOpen}
                                    onClose={() => setQRCodeOpen(false)}
                                    title="Ihr Refraktionsprotokoll"
                                >
                                    {renderQrCode()}
                                </Modal>
                            </Group>
                        </Container>
                    ) : (
                        <Button
                            disabled={!areActionsAllowed}
                            size="xs"
                            sx={(_) => ({ alignSelf: "end" })}
                            color={isDarkMode ? "black" : "white"}
                            leftIcon={<Printer {...actionItemStyleProps} />}
                            onClick={() => areActionsAllowed && window.print()}
                        >
                            <Text color={theme.colors.primary[7]}>Drucken</Text>
                        </Button>
                    )}
                </Stack>
            </Group>
        </Paper>
    );
};
