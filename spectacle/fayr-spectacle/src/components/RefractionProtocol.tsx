import {
    Badge,
    ColorSwatch,
    Container,
    Grid,
    Group,
    Modal,
    Space,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import moment from "moment";
import React, { PropsWithChildren, useState } from "react";
import { Eye, Printer, Qrcode } from "tabler-icons-react";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import { RefractionProtocolQRCode } from "~/components/QRCode";

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
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.sphere}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.cylinder}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.axis}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.addition ?? "-"}</GridText>
                </Grid.Col>
                <Grid.Col span={2}>
                    <GridText isDarkMode={isDarkMode}>{sideConfiguration.pd}</GridText>
                </Grid.Col>
            </>
        );
    };

    const actionItemStyleProps = {
        size: 30,
        style: {
            backgroundColor: !areActionsAllowed
                ? theme.colors.gray[6]
                : isDarkMode
                ? theme.black
                : theme.white,
            color: theme.colors.primary[7],
            borderRadius: "5px",
            padding: "2px",
        },
    };

    return (
        <Stack
            spacing="xs"
            onClick={onClick}
            sx={(_) => ({
                background: isArchived ? BackgroundGrey : theme.colors.primary[7],
            })}
        >
            <Container mt="xs" sx={(_) => ({ padding: 0 })}>
                <Group direction="row" position="center" noWrap>
                    <Eye
                        size={40}
                        style={{
                            backgroundColor: themedColor,
                            color: theme.colors.primary[7],
                            borderRadius: "10px",
                        }}
                    />
                    <Text color={themedColor} size="xxs" transform="uppercase">
                        Refraktionsprotokoll
                    </Text>
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
                                <RefractionProtocolQRCode refractionProtocol={entity} />
                            </Modal>
                        </Group>
                    </Container>
                </>
            )}
            <Space />
        </Stack>
    );
};
