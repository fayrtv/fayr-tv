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
    useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Auth } from "aws-amplify";
import Router from "next/router";
import React, { PropsWithChildren } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

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

const SignIn: NextPageWithLayout = () => {
    const { colorScheme } = useMantineColorScheme();

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
                        const user = await Auth.signIn(email, password);
                        console.log(user);
                        await Router.push("/welcome");
                    } catch (error) {
                        console.log("error signing in", error);
                    }
                })}
            >
                <TextInput required label="E-Mail" {...form.getInputProps("email")} mt="md" />
                <PasswordInput
                    required
                    label="Password"
                    {...form.getInputProps("password")}
                    mt="xs"
                />

                <Group position="right" mt="xs">
                    <Anchor
                        href="/auth/recover"
                        size="xs"
                        sx={(theme) => ({
                            color: theme.colors.gray[5],
                            textDecoration: "underline",
                            ":hover": { color: theme.colors.primary },
                        })}
                    >
                        Login-Daten vergessen?
                    </Anchor>
                </Group>

                <Group position="center" mt="md">
                    <Button type="submit" styles={{ inner: { fontWeight: "lighter" } }}>
                        Anmelden
                    </Button>
                </Group>
            </form>

            <Box sx={{ textAlign: "center", maxWidth: 250 }} mx="auto" mt="lg">
                <Text size="sm">
                    Noch kein Benutzerkonto?{" "}
                    <Anchor href="signup" size="sm">
                        Hier kostenlos registrieren
                    </Anchor>{" "}
                    für den{" "}
                    <Anchor
                        sx={(theme) => ({
                            color: colorScheme === "dark" ? theme.white : theme.black,
                            textDecoration: "underline",
                            ":hover": { color: theme.colors.primary },
                        })}
                        href="/about/digital-spectacle-passport"
                        target="__blank"
                        size="sm"
                    >
                        Digitalen Brillenpass
                    </Anchor>
                    .
                </Text>
            </Box>
        </BodyShell>
    );
};

SignIn.layoutProps = {
    Layout,
};

export default SignIn;
