import {
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    CheckboxGroup,
    Container,
    Grid,
    Group,
    Image,
    PasswordInput,
    Select,
    Stack,
    Text,
    TextInput,
    useMantineColorScheme,
} from "@mantine/core";
import { SelectDropdown } from "@mantine/core/lib/components/Select/SelectDropdown/SelectDropdown";
import { useForm } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { PropsWithChildren, useState } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

const BodyShell = ({ children }: PropsWithChildren<{}>) => {
    const { colorScheme } = useMantineColorScheme();
    return (
        <Container size="sm" mt="lg">
            <Group sx={{ alignItems: "flex-start" }}>
                <ZeissLogo />
                <Box>
                    <Text transform="uppercase" color="primary" weight="bold" size="lg">
                        Registrierung
                    </Text>
                    <Text
                        // color={colorScheme === "light" ? "black" : "white"}
                        size="lg"
                        weight="bold"
                        mt="xs"
                    >
                        Legen Sie sich Ihren kostenlosen Digitalen Brillenpass an.
                    </Text>
                </Box>
            </Group>
            <Box mt="xl">{children}</Box>
        </Container>
    );
};

const SignUp: NextPageWithLayout<Props> = ({ providers }) => {
    const form = useForm({
        initialValues: {
            address: "",
            title: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            newsletter: false,
            termsAndConditions: false,
        },

        errorMessages: {
            confirmPassword: (value, values) =>
                value !== values?.password ? <>"Passwords did not match"</> : null,
        },

        validationRules: {
            confirmPassword: (value, values) =>
                value !== values?.password ? "Passwords did not match" : null,
        },
    });

    return (
        <BodyShell>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                {/* TODO: No grid with columns on mobile */}
                <Grid gutter="lg">
                    <Grid.Col span={6}>
                        <Stack spacing="sm">
                            <Group grow>
                                <Select
                                    data={[
                                        { label: "Herr", value: "m" },
                                        { label: "Frau", value: "f" },
                                    ]}
                                    label="Anrede"
                                    placeholder="Herr / Frau"
                                    required
                                    {...form.getInputProps("address")}
                                />
                                <TextInput label="Titel" {...form.getInputProps("title")} />
                            </Group>
                            <TextInput
                                required
                                label="Vorname"
                                {...form.getInputProps("firstName")}
                            />
                            <TextInput
                                required
                                label="Nachname"
                                {...form.getInputProps("lastName")}
                            />
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Stack spacing="sm">
                            <TextInput required label="E-Mail" {...form.getInputProps("email")} />
                            <PasswordInput
                                required
                                label="Passwort"
                                placeholder="Passwort"
                                {...form.getInputProps("password")}
                            />
                            <PasswordInput
                                required
                                label="Passwort bestätigen"
                                placeholder="erneut eingeben"
                                {...form.getInputProps("confirmPassword")}
                            />

                            <Checkbox
                                mt="sm"
                                label="Bitte informieren Sie mich regelmäßig über Angebote und Neuigkeiten per E-Mail."
                                {...form.getInputProps("newsletter")}
                            />
                            <Checkbox
                                mt="sm"
                                label={
                                    <>
                                        Ich akzeptiere die{" "}
                                        <Anchor href="/legal/terms" size="sm" target="__blank">
                                            Allgemeinen Geschäftsbedingungen
                                        </Anchor>{" "}
                                        und die{" "}
                                        <Anchor
                                            href="/legal/data-protection"
                                            size="sm"
                                            target="__blank"
                                        >
                                            Bestimmungen zum Datenschutz
                                        </Anchor>
                                    </>
                                }
                                required
                                {...form.getInputProps("termsAndConditions")}
                            />
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Group position="right" mt="md">
                    <Button type="submit">Benutzerkonto anlegen</Button>
                </Group>
            </form>
        </BodyShell>
    );
};

SignUp.layoutProps = {
    Layout,
};

const validateEmail = (email: string) =>
    String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignUp;
