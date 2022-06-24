import { Box, Container, Grid, Group, Stack, Text } from "@mantine/core";
import { Auth, DataStore } from "aws-amplify";
import Router from "next/router";
import React, { PropsWithChildren } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import useBreakpoints from "~/hooks/useBreakpoints";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { Customer } from "~/models";

const BodyShell = ({ children }: PropsWithChildren<{}>) => {
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
    const store = useStoreInfo();
    const { onSubmit, profileComponents } = useProfileForm({
        onSubmit: async ({ address, firstName, title, lastName, password, email, newsletter }) => {
            const res = await Auth.signUp({
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
            const userId = res.userSub;

            const newCustomer = new Customer({
                userID: userId,
                customerOfStoreID: store.id,
            });
            await DataStore.save(newCustomer);

            await Router.push("/auth/confirm");
        },
        errorTitle: "Fehler beim Einloggen",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
    });

    const { isMobile } = useBreakpoints();

    return (
        <BodyShell>
            <form onSubmit={onSubmit}>
                {profileComponents.renderError()}
                {profileComponents.renderLoadingOverlay()}
                <Group noWrap={!isMobile} align="top" spacing={isMobile ? "sm" : "lg"}>
                    {/* No clue why, but the 2x width: 100% works... */}
                    <Stack spacing="sm" sx={{ width: "100%" }}>
                        <Group grow>
                            {profileComponents.renderAddressSelection()}
                            {profileComponents.renderTitleInput()}
                        </Group>
                        {profileComponents.renderFirstNameInput()}
                        {profileComponents.renderLastNameInput()}
                    </Stack>

                    <Stack spacing="sm" sx={{ width: "100%" }}>
                        {profileComponents.renderEmailInput()}
                        {profileComponents.renderPasswordInput()}
                        {profileComponents.renderConfirmPasswordInput()}

                        {profileComponents.renderNewsletterCheckbox()}
                        {profileComponents.renderTermsCheckbox()}
                    </Stack>
                </Group>

                <Group position="right" mt="md">
                    {profileComponents.renderSubmitButton("Benutzerkonto anlegen")}
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

export const validateEmail = (email: string) =>
    String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

export default SignUpPage;
