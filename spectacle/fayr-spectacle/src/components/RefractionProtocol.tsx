import {
    Badge,
    Button,
    Center,
    ColorSwatch,
    Container,
    createStyles,
    Grid,
    Group,
    Modal,
    Paper,
    Stack,
    Sx,
    Text,
    useMantineTheme,
} from "@mantine/core";
import moment from "moment";
import React, { PropsWithChildren, useState } from "react";
import { Eye, Printer, Qrcode } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import {
    RefractionProtocol as RefractionProtocolModel,
    SideConfiguration,
} from "~/types/refraction-protocol";
import { RefractionProtocolQRCode } from "~/components/QRCode";
import useBreakpoints from "~/hooks/useBreakpoints";
import useEncryption from "~/hooks/useEncryption";
import { useSession } from "../hooks/useSession";
import { useStoreInfo } from "./StoreInfoProvider";
import { SerializedAesEncryptionPackage } from "../utils/encryption/encryptionTypes";

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

const useStyles = createStyles((theme) => ({
    actionItem: {
        size: 30,
        style: {
            color: theme.colors.primary[6],
            borderRadius: "5px",
            padding: "2px",
        },
        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            backgroundColor: theme.colorScheme === "dark" ? theme.black : theme.white,
        },
    },
}));

export const RefractionProtocol = ({
    areActionsAllowed,
    entity,
    userName,
    isSelected,
    isArchived = false,
    onClick,
}: Props) => {
    const theme = useMantineTheme();
    const { isTablet } = useBreakpoints();

    const { classes } = useStyles();
    const encryption = useEncryption();

    const [qrCodeOpen, setQRCodeOpen] = useState(false);

    const [refractionProtocol, setRefractionProtocol] =
        React.useState<RefractionProtocolModel | null>(null);

    const isDarkMode = theme.colorScheme === "dark";
    const themedColor = isDarkMode ? theme.black : theme.white;

    const { user } = useSession();
    const store = useStoreInfo();

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

    const createRefractionProtocolSideMobile = (
        property: keyof SideConfiguration,
        heading: string,
        shortDescription: string,
        addBackgroundDecoration: boolean = false,
    ) => {
        if (!refractionProtocol) {
            return <>Kein Refraktionsprotokoll vorhanden</>;
        }
        const backgroundSx: Sx = (_) => ({
            backgroundColor: addBackgroundDecoration ? "rgb(217, 217, 217, 0.25)" : "auto",
        });

        return (
            <>
                <Grid.Col span={1} sx={backgroundSx}>
                    {createGridHeading(heading, shortDescription)}
                </Grid.Col>
                <Grid.Col span={1} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>
                        {refractionProtocol.left[property] ?? "-"}
                    </GridText>
                </Grid.Col>
                <Grid.Col span={1} sx={backgroundSx}>
                    <GridText isDarkMode={isDarkMode}>
                        {refractionProtocol.right[property] ?? "-"}
                    </GridText>
                </Grid.Col>
            </>
        );
    };

    React.useEffect(() => {
        const initializeData = async () => {
            let data = entity.data as any | SerializedAesEncryptionPackage;

            if (data.model && data.iv) {
                if (!user) {
                    setRefractionProtocol(null);
                    return;
                }
                data = JSON.parse(
                    await encryption.decrypt(
                        {
                            encodedInitializationVector: data.iv,
                            encryptedPayload: data.model,
                        },
                        user!.id,
                        store.id,
                    ),
                );
            }

            setRefractionProtocol(data);
        };

        initializeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity, user]);

    const createRefractionProtocolSide = (side: "L" | "R") => {
        const sideConfiguration =
            side === "L" ? refractionProtocol!.left : refractionProtocol!.right;

        const backgroundSx: Sx = (_) => ({
            backgroundColor: side === "L" ? "rgb(217, 217, 217, 0.25)" : "auto",
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

    if (!isSelected) {
        if (!refractionProtocol) {
            return <>Loading</>;
        }

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
                        <Text
                            color={themedColor}
                            size={isTablet ? "xxs" : "xs"}
                            transform="uppercase"
                        >
                            Refraktionsprotokoll
                        </Text>
                    </Group>
                    <Group direction="column" align="end" spacing="xs">
                        <Badge
                            size="xs"
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
            <Group direction="row" noWrap>
                {!isTablet && (
                    <Stack
                        spacing="xs"
                        sx={(theme) => ({
                            flexGrow: 2,
                            borderRight: `2px solid ${themedColor}`,
                            paddingRight: theme.spacing.xl,
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
                )}
                <Stack spacing="xs" onClick={onClick} sx={(_) => ({ flexGrow: 3 })}>
                    {isTablet ? (
                        <Grid columns={3} sx={(_) => ({ margin: "auto 5px" })}>
                            <Grid.Col span={1} offset={1}>
                                <Grid.Col span={1}>
                                    <ColorSwatch color={themedColor} radius={5}>
                                        <Text
                                            color={theme.colors.primary[6]}
                                            size="md"
                                            weight="800"
                                        >
                                            L
                                        </Text>
                                    </ColorSwatch>
                                </Grid.Col>
                            </Grid.Col>
                            <Grid.Col span={1}>
                                <Grid.Col span={1}>
                                    <ColorSwatch color={themedColor} radius={5}>
                                        <Text
                                            color={theme.colors.primary[6]}
                                            size="md"
                                            weight="800"
                                        >
                                            R
                                        </Text>
                                    </ColorSwatch>
                                </Grid.Col>
                            </Grid.Col>
                            {createRefractionProtocolSideMobile("sphere", "Sphäre", "S / SPH")}
                            {createRefractionProtocolSideMobile(
                                "cylinder",
                                "Zylinder",
                                "ZYL / CYL",
                                true,
                            )}
                            {createRefractionProtocolSideMobile("axis", "Achse", "A / ACH")}
                            {createRefractionProtocolSideMobile(
                                "addition",
                                "Addition",
                                "ADD",
                                true,
                            )}
                            {createRefractionProtocolSideMobile("pd", "PD", "PD")}
                            {createRefractionProtocolSideMobile("prisma", "Prisma", "PR", true)}
                            {createRefractionProtocolSideMobile("basis", "Basis", "BA")}
                        </Grid>
                    ) : (
                        <Grid columns={15} sx={(_) => ({ margin: "auto 5px" })}>
                            <Grid.Col span={2} offset={1}>
                                {createGridHeading("Sphäre", "S / SPH")}
                            </Grid.Col>
                            <Grid.Col span={2}>
                                {createGridHeading("Zylinder", "ZYL / CYL")}
                            </Grid.Col>
                            <Grid.Col span={2}>{createGridHeading("Achse", "A / ACH")}</Grid.Col>
                            <Grid.Col span={2}>{createGridHeading("Addition", "ADD")}</Grid.Col>
                            <Grid.Col span={2}>{createGridHeading("PD", "PD")}</Grid.Col>
                            <Grid.Col span={2}>{createGridHeading("Prisma", "PR")}</Grid.Col>
                            <Grid.Col span={2}>{createGridHeading("Basis", "BA")}</Grid.Col>

                            {createRefractionProtocolSide("L")}
                            {createRefractionProtocolSide("R")}
                        </Grid>
                    )}
                    {isTablet ? (
                        <Container fluid sx={(_) => ({ margin: "auto 0", width: "100%" })}>
                            <Group direction="row" position="center">
                                <Printer
                                    className={classes.actionItem}
                                    onClick={() => areActionsAllowed && window.print()}
                                />
                                <Qrcode
                                    className={classes.actionItem}
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
                            leftIcon={<Printer className={classes.actionItem} />}
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
