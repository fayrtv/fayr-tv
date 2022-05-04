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
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { PropsWithChildren, useState } from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

const BodyShell = ({ children }: PropsWithChildren<{}>) => {
    return (
        <Container size="md" mt="lg">
            <Group sx={{ alignItems: "flex-start" }}>
                <Image src={"/assets/zeiss_logo.svg"} alt="ZEISS Logo" width={80} />
                <Box>
                    <Text transform="uppercase" color="primary" weight="bold" size="lg">
                        Registrierung
                    </Text>
                    <Text color="black" size="lg" weight="bold" mt="xs">
                        Legen Sie sich Ihren kostenlosen Digitalen Brillenpass an.
                    </Text>
                </Box>
            </Group>
            <Box mt="xl">{children}</Box>
        </Container>
    );
};

const SignUp: NextPageWithLayout<Props> = ({ providers }) => {
    const isValid = false;

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
                        <Group grow>
                            <TextInput
                                label="Anrede"
                                placeholder="Herr / Frau"
                                {...form.getInputProps("address")}
                            />
                            <TextInput label="Titel" {...form.getInputProps("title")} />
                        </Group>
                        <TextInput label="Vorname" {...form.getInputProps("firstName")} />
                        <TextInput label="Nachname" {...form.getInputProps("lastName")} />

                        <Box mt="md">
                            <Checkbox
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
                                {...form.getInputProps("termsAndConditions")}
                            />
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput label="E-Mail" {...form.getInputProps("email")} />
                        <PasswordInput
                            label="Passwort"
                            placeholder="Passwort"
                            {...form.getInputProps("password")}
                        />
                        <PasswordInput
                            label="Passwort bestätigen"
                            placeholder="erneut eingeben"
                            {...form.getInputProps("confirmPassword")}
                        />

                        <Group position="right" mt="md">
                            <Button type="submit">Benutzerkonto anlegen</Button>
                        </Group>
                    </Grid.Col>
                </Grid>
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
