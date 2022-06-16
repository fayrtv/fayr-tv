import { Box, Button, Center, Group, MediaQuery, Paper, Tabs } from "@mantine/core";
import { CalendarPlus, Tool, User as UserIcon } from "tabler-icons-react";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import { ShowProfile } from "~/components/layout/ShowProfile";

type Props = {
    showAppointmentCTA?: boolean;
};

const SubHeader = ({ showAppointmentCTA = true }: Props) => {
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
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box>
                    <ShowProfile user={user} />
                </Box>
            </Group>
        </Paper>
    );
};

export default SubHeader;
