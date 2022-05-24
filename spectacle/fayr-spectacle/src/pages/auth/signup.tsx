import {
    Alert,
    Anchor,
    Box,
    Button,
    Checkbox,
    Container,
    Grid,
    Group,
    LoadingOverlay,
    PasswordInput,
    Select,
    Stack,
    Text,
    TextInput,
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
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";

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

const SignUpPage: NextPageWithLayout = () => {
    const {
        onSubmit,
        renderError,
        renderLoadingOverlay,
        renderAddressSelection,
        renderTitleInput,
        renderFirstNameInput,
        renderLastNameInput,
        renderEmailInput,
        renderPasswordInput,
        renderConfirmPasswordInput,
        renderNewsletterCheckbox,
        renderTermsCheckbox,
        renderSubmitButton,
    } = useProfileForm({
        onSubmit: async ({ address, firstName, title, lastName, password, email, newsletter }) => {
            await Auth.signUp({
                username: email,
                password,
                attributes: {
                    family_name: lastName,
                    "custom:address": address,
                    "custom:first_name": firstName,
                    "custom:title": title ?? "",
                    "custom:newsletter": String(newsletter),
                },
            });
            await Router.push("/auth/confirm");
        },
        errorTitle: "Fehler beim Einloggen",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
    });

    return (
        <BodyShell>
            <form onSubmit={onSubmit}>
                {renderError()}
                {renderLoadingOverlay()}
                {/* TODO: No grid with columns on mobile */}
                <Grid gutter="lg">
                    <Grid.Col span={6}>
                        <Stack spacing="sm">
                            <Group grow>
                                {renderAddressSelection()}
                                {renderTitleInput()}
                            </Group>
                            {renderFirstNameInput()}
                            {renderLastNameInput()}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Stack spacing="sm">
                            {renderEmailInput()}
                            {renderPasswordInput()}
                            {renderConfirmPasswordInput()}

                            {renderNewsletterCheckbox()}
                            {renderTermsCheckbox()}
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Group position="right" mt="md">
                    {renderSubmitButton("Benutzerkonto anlegen")}
                </Group>
            </form>
        </BodyShell>
    );
};

SignUpPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

const validateEmail = (email: string) =>
    String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

export default SignUpPage;
