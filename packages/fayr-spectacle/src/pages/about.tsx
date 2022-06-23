import {
    Box,
    Container,
    createStyles,
    Group,
    Image,
    MediaQuery,
    Paper,
    Stack,
    Sx,
    Text,
} from "@mantine/core";
import React, { PropsWithChildren } from "react";
import PassportQRCodeExample from "~/components/PassportQRCode";
import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import Link from "next/link";
import { Anchor } from "@mantine/core";
import { SerializedModel, serializeModel } from "~/models/amplify-models";
import { RefractionProtocol as RefractionProtocolEntity } from "~/models";
import { GetServerSideProps } from "next";
import { RedirectProps, redirectServerSide } from "~/helpers/next-server";
import { withSSRContext } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { ssrGetUser } from "~/helpers/authentication";
import { RefractionProtocol as RefractionProtocolModel } from "~/types/refraction-protocol";
import SpectaclePassPage from "~/pages/spectaclepass";

const NumberBox = ({ n, title, children }: PropsWithChildren<{ n: number; title: string }>) => {
    return (
        <Group noWrap align="flex-start">
            <Text
                sx={(theme) => ({ fontSize: 90, minWidth: 58, userSelect: "none" })}
                weight="bold"
                mt={-9}
            >
                {n}
            </Text>
            <Paper>
                <h2>{title}</h2>
                {children}
            </Paper>
        </Group>
    );
};

const useStyles = createStyles((theme) => ({
    container: {
        maxWidth: "unset",
        [`@media(max-width: ${theme.breakpoints.md}px)`]: {
            padding: 15,
        },
    },
    group: {
        flexDirection: "row",
        [`@media(max-width: ${theme.breakpoints.lg}px)`]: {
            flexDirection: "column",
        },
    },
    howItWorksBox: {
        marginLeft: theme.spacing.xl,
        [`@media(max-width: ${theme.breakpoints.md}px)`]: {
            marginLeft: theme.spacing.md,
        },
    },
}));

type ServerProps = {
    latestRefractionProtocol?: SerializedModel<RefractionProtocolEntity>;
};

const AboutDigitalSpectaclePassportPage: NextPageWithLayout = ({
    latestRefractionProtocol,
}: ServerProps) => {
    const storeInfo = useStoreInfo();
    const { classes } = useStyles();

    return (
        <Container className={classes.container}>
            <Group position="apart" className={classes.group} noWrap>
                <Stack spacing="lg">
                    <MediaQuery styles={{ padding: 15 }} smallerThan="sm">
                        <Paper
                            shadow="xl"
                            // sx={{
                            //     boxShadow: "0px 0px 10px 0px #00000040",
                            // }}
                            p={70}
                            radius="xs"
                        >
                            <PassportQRCodeExample refractionProtocol={latestRefractionProtocol} />
                        </Paper>
                    </MediaQuery>
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
                <Box className={classes.howItWorksBox}>
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

AboutDigitalSpectaclePassportPage.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async ({ req, res }) => {
    const SSR = withSSRContext({ req });
    const store = SSR.DataStore as typeof DataStore;

    const user = await ssrGetUser(req);

    if (!user?.email) {
        return {
            props: {},
        };
    }

    const userProtocols = await store.query(RefractionProtocolEntity, (x) =>
        x.userID("eq", user.email),
    );

    return {
        props: {
            latestRefractionProtocol: userProtocols.length
                ? serializeModel(userProtocols[0])
                : undefined,
        },
    };
};

export default AboutDigitalSpectaclePassportPage;