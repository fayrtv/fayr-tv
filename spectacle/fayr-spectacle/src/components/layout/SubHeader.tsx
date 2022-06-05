import { Box, Button, Center, Group, MediaQuery, Paper, Tabs } from "@mantine/core";
import { CalendarPlus, Tool, User as UserIcon } from "tabler-icons-react";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import { ShowProfile } from "~/components/layout/ShowProfile";

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
                                        backgroundColor: `${theme.colors.primary[6]} !important`,
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
                    <ShowProfile user={user} />
                </Box>
            </Group>
        </Paper>
    );
};

export default SubHeader;
