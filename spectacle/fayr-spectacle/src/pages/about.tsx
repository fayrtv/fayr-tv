import { Box, Container, Group, Image, Paper, Stack, Sx, Text } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import PassportQRCodeExample from "~/components/PassportQRCode";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import Link from "next/link";
import { Anchor } from "@mantine/core";
import useIsMobile from "~/hooks/useIsMobile";

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

    const isMobile = useIsMobile();

    const containerSxProps: Sx = { maxWidth: "unset" };

    if (isMobile) {
        containerSxProps.padding = 15;
    }

    return (
        <Container sx={containerSxProps}>
            <Group position="apart" direction={isMobile ? "column" : "row"} noWrap>
                <Stack spacing="lg">
                    <Paper
                        shadow="xl"
                        // sx={{
                        //     boxShadow: "0px 0px 10px 0px #00000040",
                        // }}
                        p={isMobile ? 15 : 70}
                        radius="xs"
                    >
                        <PassportQRCodeExample />
                    </Paper>
                    <Box
                        sx={(theme) => ({
                            backgroundColor:
                                theme.colors.gray[theme.colorScheme === "dark" ? 7 : 5],
                        })}
                    >
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
                            <Image
                                src="/assets/undraw_selfie_re_h9um.svg"
                                alt="Person mit Brille"
                                width={84}
                            />
                        </Group>
                    </Box>
                </Stack>
                <Box ml={isMobile ? "md" : "xl"}>
                    <Text color="primary">
                        <h1>So funktioniert der Digitale Brillenpass</h1>
                    </Text>
                    <Stack spacing="lg">
                        <NumberBox n={1} title="Vereinbaren Sie einen Termin">
                            Kommen Sie ins {storeInfo.name} {storeInfo.city} und machen Sie einen
                            Sehtest. Sie können sich über die Funktion{" "}
                            <Link href="/appointment" passHref>
                                <Anchor>Termin vereinbaren</Anchor>
                            </Link>{" "}
                            einen Termin aussuchen, oder rufen Sie uns an unter{" "}
                            <span style={{ userSelect: "all" }}>{storeInfo.phoneNumber}</span>.
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
