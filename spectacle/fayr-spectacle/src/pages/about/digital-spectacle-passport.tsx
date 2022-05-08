import { Box, Center, Container, Group, Image, Paper, Stack, Text } from "~/components/common";
import React, { PropsWithChildren } from "react";
import PassportQRCodeExample from "~/components/PassportQRCode";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import {useStoreInfo} from "~/components/StoreInfoProvider";

const NumberBox = ({ n, title, children }: PropsWithChildren<{ n: number; title: string }>) => {
    return (
        <Group noWrap align="flex-start">
            <Text sx={{ fontSize: 90 }} weight="bold" mt={-9}>
                {n}
            </Text>
            <Paper>
                <h2>{title}</h2>
                {children}
            </Paper>
        </Group>
    );
};

const DigitalSpectaclePassportPage: NextPageWithLayout = () => {
    const storeInfo = useStoreInfo();


    return (
        <Container sx={{ maxWidth: "unset" }} p="xl">
            <Group position="apart" noWrap>
                <Stack spacing="lg">
                    <Paper
                        shadow="xl"
                        // sx={{
                        //     boxShadow: "0px 0px 10px 0px #00000040",
                        // }}
                        p={70}
                        radius="xs"
                    >
                        <PassportQRCodeExample />
                    </Paper>
                    <Box sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}>
                        <Group px="xl" py="md" noWrap>
                            <Stack>
                                <Text color="white" size="md" weight="bold">
                                    Online Brillen anprobieren
                                </Text>
                                <Text size="sm">
                                    Finden Sie die richtige Brille. Probieren Sie online die
                                    verschiedenen Gestelle aus unserem Sortiment aus.
                                </Text>
                            </Stack>
                            <Image src="/assets/undraw_selfie_re_h9um.svg" width={84} />
                        </Group>
                    </Box>
                </Stack>
                <Box ml="xl">
                    <Text color="primary">
                        <h1>So funktioniert der Digitale Brillenpass</h1>
                    </Text>
                    <Stack spacing="lg">
                        <NumberBox n={1} title="Vereinbaren Sie einen Termin">
                            Kommen Sie ins {storeInfo.name} {storeInfo.city} und machen Sie einen
                            Sehtest. Sie können entweder über die Funktion Termin vereinbaren sich
                            einen Termin aussuchen oder telefonisch vereinbaren unter {storeInfo.phoneNumber}
                        </NumberBox>
                        <NumberBox
                            n={2}
                            title="Lassen Sie sich ein Refraktionsprotokoll ausstellen"
                        >
                            Ihr/e Optiker/in stellt Ihnen nach dem Sehtest ein Refraktionsprotokoll
                            aus. Teilen Sie Ihre E-Mail-Adresse Ihrem/r Optiker/in mit, um das
                            Refraktionsprotokoll Ihrem Digitalen Brillenpass hinzuzufügen.
                        </NumberBox>
                        <NumberBox n={3} title="Zeigen Sie Ihren Digitalen Brillenpass vor">
                            Bei jedem Optikerbesuch können Sie bequem Ihren Digitalen Brillenpass
                            vorzeigen. Ihr/e Optiker/in kann für eine einfache Übermittelung den
                            QR-Code einscannen.
                        </NumberBox>
                    </Stack>
                </Box>
            </Group>
        </Container>
    );
};

DigitalSpectaclePassportPage.layoutProps = {
    Layout,
};

export default DigitalSpectaclePassportPage;
