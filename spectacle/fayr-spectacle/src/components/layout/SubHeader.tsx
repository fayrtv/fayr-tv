import { Button, Text } from "~/components/common";
import { CalendarPlus } from "tabler-icons-react";
import { Avatar, Grid, Group, Paper, Tabs } from "@mantine/core";
import { formatFormalAddress, User } from "~/types/user";
import { useSession } from "~/hooks/useSession";

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
            <Grid>
                <Grid.Col span={4}>
                    {showAppointmentCTA && (
                        <Button color="secondary" size="xs">
                            <Group spacing="sm">
                                <CalendarPlus color="black" size={15} />
                                <Text size="sm" color="black">
                                    Termin vereinbaren
                                </Text>
                            </Group>
                        </Button>
                    )}
                </Grid.Col>
                <Grid.Col span={4}>
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
                                tabInner: { margin: "1px" },
                            })}
                        >
                            <Tabs.Tab
                                disabled={
                                    !(
                                        switchAvailability === SwitchAvailability.Both ||
                                        switchAvailability === SwitchAvailability.CustomerOnly
                                    )
                                }
                                label="Für Kunden"
                            />
                            <Tabs.Tab
                                disabled={
                                    !(
                                        switchAvailability === SwitchAvailability.Both ||
                                        switchAvailability === SwitchAvailability.OpticianOnly
                                    )
                                }
                                label="Für Optiker"
                            />
                        </Tabs>
                    )}
                </Grid.Col>
                <Grid.Col span={4} sx={{ justifyContent: "right" }}>
                    <Group position="right">
                        {!!user && (
                            <Text weight="bold" size="xs">
                                Willkommen, {formatFormalAddress(user)}
                            </Text>
                        )}
                        <Avatar size="sm" />
                    </Group>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default SubHeader;
