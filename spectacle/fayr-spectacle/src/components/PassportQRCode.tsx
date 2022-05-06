import { Box, Center, Grid, Group, SimpleGrid, Stack, Text, useMantineTheme } from "@mantine/core";
import QRCode from "~/components/QRCode";
import ChevronRightCircle from "~/components/icons/ChevronRightCircle";

export default function PassportQRCodeExample() {
    // TODO: Define
    const theme = useMantineTheme();
    const qrCodeContent = "https://example.com";

    return (
        <Box sx={(theme) => ({ backgroundColor: theme.colors.cyan[0] })}>
            <Stack spacing="md" px="md" py="sm">
                <Group position="apart">
                    <Stack spacing={0}>
                        <Text weight="bold" color="white" size="sm">
                            Digitaler Brillenpass
                        </Text>
                        <Text size="xs" color="white">
                            Max Mustermann
                        </Text>
                    </Stack>
                    <ChevronRightCircle />
                </Group>
                <Center px={20} pb={5}>
                    <QRCode
                        content={qrCodeContent}
                        background={theme.white}
                        padding={2}
                        width={170}
                        height={170}
                    />
                </Center>
            </Stack>
        </Box>
    );
}
