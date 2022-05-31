import { ActionIcon, Box, Button, Center, createStyles, MediaQuery, Text } from "@mantine/core";
import { CalendarPlus, Tool, User as UserIcon } from "tabler-icons-react";
import { Anchor, Avatar, Grid, Group, Paper, Tabs } from "@mantine/core";
import { formatFormalAddress } from "~/types/user";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import useIsMobile from "~/hooks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";

export enum SwitchAvailability {
    Unavailable,
    CustomerOnly,
    OpticianOnly,
    Both,
}

type Props = {
    showAppointmentCTA?: boolean;
    switchAvailability?: SwitchAvailability;
};

const SubHeader = ({
    switchAvailability = SwitchAvailability.Both,
    showAppointmentCTA = true,
}: Props) => {
    const { user } = useSession();

    return (
        <Paper px="md" py="sm" shadow="sm" sx={(theme) => ({ fontSize: theme.fontSizes.sm })}>
            <Group sx={{ width: "100%" }} spacing={0}>
                <Box>
                    {showAppointmentCTA && (
                        <Link href="/appointment" passHref>
                            <Button
                                leftIcon={
                                    <MediaQuery smallerThan="xs" styles={{ marginRight: -9 }}>
                                        <CalendarPlus />
                                    </MediaQuery>
                                }
                                color="secondary"
                                styles={(theme) => ({ root: { color: theme.colors.gray[9] } })}
                                size="sm"
                                component="a"
                            >
                                <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                                    <span>Termin vereinbaren</span>
                                </MediaQuery>
                            </Button>
                        </Link>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {switchAvailability !== SwitchAvailability.Unavailable && (
                        <Center>
                            <Tabs
                                variant="default"
                                styles={(theme) => ({
                                    tabActive: {
                                        backgroundColor: `${theme.colors.primary[7]} !important`,
                                        color: `${theme.white} !important`,
                                    },
                                    tabLabel: {
                                        padding: theme.spacing.xs,
                                        fontSize: theme.fontSizes.xs,
                                    },
                                    tabsList: {
                                        justifyContent: "center",
                                    },
                                })}
                                orientation="horizontal"
                            >
                                <Tabs.Tab
                                    disabled={
                                        !(
                                            switchAvailability === SwitchAvailability.Both ||
                                            switchAvailability === SwitchAvailability.CustomerOnly
                                        )
                                    }
                                    label={
                                        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                                            <span>Für Kunden</span>
                                        </MediaQuery>
                                    }
                                    icon={<UserIcon size={14} />}
                                />
                                <Tabs.Tab
                                    disabled={
                                        !(
                                            switchAvailability === SwitchAvailability.Both ||
                                            switchAvailability === SwitchAvailability.OpticianOnly
                                        )
                                    }
                                    label={
                                        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                                            <span>Für Optiker</span>
                                        </MediaQuery>
                                    }
                                    icon={<Tool size={14} />}
                                />
                            </Tabs>
                        </Center>
                    )}
                </Box>
                <Box>
                    <Link href="/profile" passHref>
                        <Anchor>
                            <Group position="right" direction="row" noWrap>
                                {!!user && (
                                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                                        <Text weight="bold" size="sm">
                                            Willkommen, {formatFormalAddress(user)}
                                        </Text>
                                    </MediaQuery>
                                )}
                                <ActionIcon variant="outline" color="primary">
                                    <Avatar color="primary" size="sm" />
                                </ActionIcon>
                            </Group>
                        </Anchor>
                    </Link>
                </Box>
            </Group>
        </Paper>
    );
};

export default SubHeader;
