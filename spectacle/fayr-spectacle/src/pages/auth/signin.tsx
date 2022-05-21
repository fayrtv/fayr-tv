import {
    Anchor,
    Box,
    Button,
    Center,
    Group,
    Overlay,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    LoadingOverlay,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Auth } from "aws-amplify";
import Router from "next/router";
import React, { PropsWithChildren, useState } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Layout, { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useMantineColorScheme } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import Link from "next/link";

const BodyShell = ({ children }: PropsWithChildren<{}>) => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
                width: "100%",
            }}
        >
            {colorScheme === "dark" && <Overlay opacity={0.6} color="black" zIndex={1} blur={2} />}
            <Paper sx={{ zIndex: 1, position: "relative" }} px="xl" py="lg">
                <Center>
                    <ZeissLogo />
                </Center>
                <Text transform="uppercase" color="primary" weight="bold" size="lg" mt={60}>
                    Anmeldung
                </Text>
                <Text
                    color={colorScheme === "light" ? "black" : "white"}
                    size="lg"
                    weight="bold"
                    mt="xs"
                >
                    Willkommen bei Ihrem
                    <br />
                    ZEISS VISION CENTER Osnabrück
                </Text>
                {children}
            </Paper>
        </Center>
    );
};

const SignInPage: NextPageWithLayout = () => {
    const { colorScheme } = useMantineColorScheme();
    const [isSubmitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | undefined>();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
    });

    return (
        <BodyShell>
            <form
                onSubmit={form.onSubmit(async ({ email, password }) => {
                    try {
                        setSubmitting(true);
                        await Auth.signIn(email, password);
                        await Router.push("/welcome");
                    } catch (error) {
                        setSubmitting(false);
                        setLoginError(String(error).replace(/^.*Exception: /, ""));
                    }
                })}
            >
                {loginError && (
                    <Alert
                        mt="md"
                        // variant="filled"
                        icon={<AlertCircle size={16} />}
                        title="Fehler beim Einloggen"
                        color="red"
                        radius="xs"
                    >
                        {loginError}
                    </Alert>
                )}
                <LoadingOverlay visible={isSubmitting} />
                <TextInput required label="E-Mail" {...form.getInputProps("email")} mt="md" />
                <PasswordInput
                    required
                    label="Password"
                    {...form.getInputProps("password")}
                    mt="xs"
                />

                <Group position="right" mt="xs">
                    <Link href="/auth/recover" passHref>
                        <Anchor
                            size="xs"
                            sx={(theme) => ({
                                color: theme.colors.gray[5],
                                textDecoration: "underline",
                                ":hover": { color: theme.colors.primary },
                            })}
                        >
                            Login-Daten vergessen?
                        </Anchor>
                    </Link>
                </Group>

                <Group position="center" mt="md">
                    <Button type="submit">Anmelden</Button>
                </Group>
            </form>

            <Box sx={{ textAlign: "center", maxWidth: 250 }} mx="auto" mt="lg">
                <Text size="sm">
                    Noch kein Benutzerkonto?{" "}
                    <Link href="signup" passHref>
                        <Anchor href="signup" size="sm">
                            Hier kostenlos registrieren
                        </Anchor>
                    </Link>{" "}
                    für den{" "}
                    <Link href="/about" passHref>
                        <Anchor
                            sx={(theme) => ({
                                color: colorScheme === "dark" ? theme.white : theme.black,
                                textDecoration: "underline",
                                ":hover": { color: theme.colors.primary },
                            })}
                            target="__blank"
                            size="sm"
                        >
                            Digitalen Brillenpass
                        </Anchor>
                    </Link>
                    .
                </Text>
            </Box>
        </BodyShell>
    );
};

SignInPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default SignInPage;
