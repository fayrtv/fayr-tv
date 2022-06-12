import {
    Anchor,
    Button,
    Group,
    PasswordInput,
    TextInput,
    LoadingOverlay,
    Alert,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Auth } from "aws-amplify";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { AlertCircle } from "tabler-icons-react";
import Link from "next/link";
import { AuthBodyShell } from "~/components/auth/AuthBodyShell";
import { useStoreInfo } from "~/components/StoreInfoProvider";

const SignInPage: NextPageWithLayout = () => {
    const [isSubmitting, setSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | undefined>();

    const storeInfo = useStoreInfo();
    const { query } = useRouter();
    const isLogout = (query["logout"] as string | undefined)?.toLowerCase() === "true";

    useEffect(() => {
        if (!isLogout) {
            return;
        }
        Auth.signOut();
    }, [isLogout]);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
    });

    return (
        <AuthBodyShell
            header={isLogout ? "Wieder anmelden" : "Anmeldung"}
            subHeader={
                !isLogout ? (
                    <>
                        Willkommen bei Ihrem
                        <br />
                        ZEISS VISION CENTER {storeInfo.city}
                    </>
                ) : (
                    <></>
                )
            }
            notification={
                isLogout && (
                    <Alert color="secondary" mb="lg">
                        Sie haben sich abgemeldet.
                    </Alert>
                )
            }
        >
            <form
                onSubmit={form.onSubmit(async ({ email, password }) => {
                    try {
                        setSubmitting(true);
                        await Auth.signIn(email, password);
                        await Router.push("/spectaclepass");
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
                    <Link href="/auth/requestpasswordreset" passHref>
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
        </AuthBodyShell>
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
