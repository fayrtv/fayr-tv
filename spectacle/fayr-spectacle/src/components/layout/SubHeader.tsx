import { Button, Text } from "@mantine/core";
import { CalendarPlus, Tool, User as UserIcon } from "tabler-icons-react";
import { Anchor, Avatar, Grid, Group, Paper, Tabs } from "@mantine/core";
import { formatFormalAddress, User } from "~/types/user";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";

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
    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);

    return (
        <Paper px="md" py="sm" shadow="sm" sx={(theme) => ({ fontSize: theme.fontSizes.sm })}>
            <Grid columns={12}>
                <Grid.Col span={isMobile ? 2 : 4}>
                    {showAppointmentCTA && (
                        <Link href="/appointment">
                            <Button color="secondary" size="xs" component="a">
                                <Group spacing="sm">
                                    <CalendarPlus color="black" size={15} />
                                    {!isMobile && (<Text size="sm" color="black">
                                        Termin vereinbaren
                                    </Text>)}
                                </Group>
                            </Button>
                        </Link>
                    )}
                </Grid.Col>
                <Grid.Col span={isMobile ? 3 : 4}>
                    {switchAvailability !== SwitchAvailability.Unavailable && (
                        <Tabs
                            variant="pills"
                            styles={(theme) => ({
                                tabActive: {
                                    backgroundColor: `${theme.colors.primary[7]} !important`,
                                    color: `${theme.white} !important`,
                                },
                                tabLabel: {
                                    padding: theme.spacing.xs,
                                    fontSize: theme.fontSizes.xs,
                                },
                                // Account for border of other button
                                tabInner: {
                                    margin: "1px",
                                },
                                tabControl: {
                                    padding: isMobile ? "7px !important" : "auto",
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
                                label={isMobile ? "" : "Für Kunden"}
                                icon={<UserIcon size={14} />}
                            />
                            <Tabs.Tab
                                disabled={
                                    !(
                                        switchAvailability === SwitchAvailability.Both ||
                                        switchAvailability === SwitchAvailability.OpticianOnly
                                    )
                                }
                                label={isMobile ? "" : "Für Optiker"}
                                icon={<Tool size={14} />}
                            />
                        </Tabs>
                    )}
                </Grid.Col>
                <Grid.Col span={isMobile ? 7 : 4} sx={{ justifyContent: "right" }}>
                    <Link href="/profile" passHref>
                        <Anchor>
                            <Group position="right" direction="row">
                                {!!user && (
                                    <Text weight="bold" size="xs">
                                        Willkommen, {formatFormalAddress(user)}
                                    </Text>
                                )}
                                <Avatar size="sm" />
                            </Group>
                        </Anchor>
                    </Link>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default SubHeader;
