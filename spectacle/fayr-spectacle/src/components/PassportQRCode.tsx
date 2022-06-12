import { Anchor, Box, Center, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import ChevronRightCircle from "~/components/icons/ChevronRightCircle";
import { QRCode, RefractionProtocolQRCode } from "~/components/QRCode";
import { useSession } from "~/hooks/useSession";
import { formatFormalAddress } from "~/types/user";
import Link from "next/link";
import { RefractionProtocol } from "~/models";
import { MAIN_URL } from "~/constants";

type Props = {
    refractionProtocol?: RefractionProtocol;
};

export default function PassportQRCodeExample({ refractionProtocol }: Props) {
    const theme = useMantineTheme();
    const { user } = useSession();

    return (
        <Box sx={(theme) => ({ backgroundColor: theme.colors.primary[6] })}>
            <Stack spacing="md" px="md" py="sm">
                <Group position="apart">
                    <Stack spacing={0}>
                        <Text weight="bold" color="white" size="sm">
                            Digitaler Brillenpass
                        </Text>
                        <Text size="xs" color="white">
                            {user ? formatFormalAddress(user) : "Max Mustermann"}
                        </Text>
                    </Stack>
                    {refractionProtocol && (
                        <Link href="/spectaclepass" passHref>
                            <Anchor>
                                <ChevronRightCircle />
                            </Anchor>
                        </Link>
                    )}
                </Group>
                <Center px={20} pb={5}>
                    {refractionProtocol ? (
                        <RefractionProtocolQRCode refractionProtocol={refractionProtocol} />
                    ) : (
                        <QRCode
                            content={`${MAIN_URL.toString()}about`}
                            background={theme.white}
                            padding={2}
                            width={170}
                            height={170}
                        />
                    )}
                </Center>
            </Stack>
        </Box>
    );
}
