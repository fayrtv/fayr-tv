import { Button, Text } from "~/components/common";
import { CalendarPlus, Settings } from "tabler-icons-react";
import { Avatar, Grid, Group, Paper, Tabs, ThemeIcon } from "@mantine/core";
import { formatFormalAddress, User } from "~/types/user";

type Props = {
    user: User;
    showAppointmentCTA?: boolean;
    showTabSwitch?: boolean;
};

const SubHeader = ({ user, showTabSwitch = false, showAppointmentCTA = true }: Props) => {
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
                    {showTabSwitch && (
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
                            <Tabs.Tab label="Für Kunden" />
                            <Tabs.Tab label="Für Optiker" />
                        </Tabs>
                    )}
                </Grid.Col>
                <Grid.Col span={4} sx={{ justifyContent: "right" }}>
                    <Group position="right">
                        <Text weight="bold" size="xs">
                            Willkommen, {formatFormalAddress(user)}
                        </Text>
                        <Avatar size="sm" />
                    </Group>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default SubHeader;
