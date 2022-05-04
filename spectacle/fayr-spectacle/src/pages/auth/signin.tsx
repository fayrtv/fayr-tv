import {
    Anchor,
    BackgroundImage,
    Box,
    Button,
    Center,
    Container,
    Group,
    Image,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Sign } from "crypto";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { useState } from "react";
import { AlignCenter } from "tabler-icons-react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

const SignIn: NextPageWithLayout<Props> = ({ providers }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            termsOfService: false,
        },
    });

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
                width: "100%",
            }}
        >
            <Container
                sx={(theme) => ({ backgroundColor: theme.white })}
                size={"lg"}
                px="xl"
                py="lg"
            >
                <Center>
                    <Image src={"/assets/zeiss_logo.svg"} alt="ZEISS Logo" width={80} />
                </Center>
                <Text transform="uppercase" color="primary" weight="bold" size="lg" mt={60}>
                    Anmeldung
                </Text>
                <Text color="black" size="lg" weight="bold" mt="xs">
                    Willkommen bei Ihrem
                    <br />
                    ZEISS VISION CENTER Osnabrück
                </Text>
                <TextInput required label="Email" {...form.getInputProps("email")} mt="md" />
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

                <Box sx={{ textAlign: "center", maxWidth: 250 }} mx="auto" mt="lg">
                    <Text color="black" size="sm">
                        Noch kein Benutzerkonto?{" "}
                        <Anchor href="signup" size="sm">
                            Hier kostenlos registrieren
                        </Anchor>{" "}
                        für den{" "}
                        <Anchor
                            sx={(theme) => ({
                                color: theme.black,
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
            </Container>
        </Center>
    );
};

SignIn.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignIn;
