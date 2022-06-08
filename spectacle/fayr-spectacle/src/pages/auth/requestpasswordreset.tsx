import { Button, Group, LoadingOverlay, Space, ThemeIcon } from "@mantine/core";
import { Auth } from "aws-amplify";
import React from "react";
import { Check } from "tabler-icons-react";
import { layoutFactory } from "~/components/layout/Layout";
import { ProfileFormData, useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { NextPageWithLayout } from "~/types/next-types";
import { BodyShell } from "./sharedSignInBodyShell";
import Router from "next/router";

enum ResetPasswordStep {
    RequestReset,
    ConfirmationCodeSent,
    SetNewPassword,
    Success,
}

type SubmitCallback = (
    userProfile: ProfileFormData,
    setError: (errorMessage: string) => void,
) => Promise<void>;

type StepMetaData = Pick<React.ComponentProps<typeof BodyShell>, "header" | "subHeader">;

const stepMetaDataMap = new Map<ResetPasswordStep, StepMetaData>([
    [
        ResetPasswordStep.RequestReset,
        {
            header: "Password zurücksetzen",
            subHeader: (
                <>
                    Geben Sie die mit Ihrem Konto
                    <br />
                    verknüpfte E-Mail-Adresse ein und
                    <br />
                    wir senden Ihnen eine E-Mail mit
                    <br />
                    Anweisungen zum Zurücksetzen
                    <br />
                    Ihres Passworts.
                </>
            ),
        },
    ],
    [
        ResetPasswordStep.ConfirmationCodeSent,
        {
            header: "Bitte überprüfen sie ihre E-Mails",
            subHeader: (
                <>
                    Wir haben ihnen die Anleitung
                    <br />
                    zum Zurücksetzen ihres Passworts
                    <br />
                    per E-Mail weitergeleitet.
                </>
            ),
        },
    ],
    [
        ResetPasswordStep.SetNewPassword,
        {
            header: "Neues Passwort erstellen",
            subHeader: (
                <>
                    Ihr neues Passwort muss sich von
                    <br />
                    ihrem vorherigen unterscheiden.
                </>
            ),
        },
    ],
    [
        ResetPasswordStep.Success,
        {
            header: "Passwort erfolgreich zurückgesetzt",
        },
    ],
]);

const RequestPasswordReset: NextPageWithLayout = () => {
    const [viewStep, setViewStep] = React.useState<ResetPasswordStep>(
        ResetPasswordStep.RequestReset,
    );

    const [username, setUsername] = React.useState<string | undefined>();

    const requestResetSubmit: SubmitCallback = async ({ email }, setError) => {
        try {
            await Auth.forgotPassword(email);
            setUsername(email);
            setViewStep(ResetPasswordStep.ConfirmationCodeSent);
        } catch (error: any) {
            const errorStringified: string = error.toString();
            if (errorStringified.indexOf("UserNotFoundException") !== -1) {
                setError("Account nicht vorhanden");
                return;
            }
            setError("Unbekannter Fehler");
        }
    };

    const setNewPasswordSubmit: SubmitCallback = async ({ confirmationCode, password }, _) => {
        await Auth.forgotPasswordSubmit(username!, confirmationCode, password);
        setViewStep(ResetPasswordStep.Success);
    };

    const { onSubmit, profileComponents, isSubmitting } = useProfileForm({
        onSubmit: async (userProfile, setError) => {
            let cb: SubmitCallback | undefined = undefined;

            switch (viewStep) {
                case ResetPasswordStep.RequestReset:
                    cb = requestResetSubmit;
                    break;
                case ResetPasswordStep.SetNewPassword:
                    cb = setNewPasswordSubmit;
                    break;
            }

            await cb?.(userProfile, setError);
        },
        errorTitle: "Fehler beim zurücksetzen des Passworts",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
        validate: {
            confirmPassword: (passwordValue, profileFormData) =>
                passwordValue !== profileFormData.password
                    ? "Passwörter stimmen nicht überein"
                    : null,
        },
    });

    return (
        <BodyShell {...stepMetaDataMap.get(viewStep)!}>
            {viewStep === ResetPasswordStep.RequestReset ? (
                <form onSubmit={onSubmit}>
                    {profileComponents.renderError()}
                    <LoadingOverlay visible={isSubmitting} />
                    <Space h="md" />
                    {profileComponents.renderEmailInput()}
                    <Space h="md" />
                    <Group position="center">
                        {profileComponents.renderSubmitButton("Senden")}
                    </Group>
                </form>
            ) : viewStep === ResetPasswordStep.ConfirmationCodeSent ? (
                <>
                    <Space h="md" />
                    <Group position="center">
                        <Button onClick={() => setViewStep(ResetPasswordStep.SetNewPassword)}>
                            Weiter
                        </Button>
                    </Group>
                </>
            ) : viewStep === ResetPasswordStep.SetNewPassword ? (
                <form onSubmit={onSubmit}>
                    {profileComponents.renderError()}
                    <LoadingOverlay visible={isSubmitting} />
                    {profileComponents.renderConfirmationCodeInput()}
                    {profileComponents.renderPasswordInput()}
                    {profileComponents.renderConfirmPasswordInput()}
                    <Space h="md" />
                    <Group position="center">
                        {profileComponents.renderSubmitButton("Senden")}
                    </Group>
                </form>
            ) : (
                <Group direction="column" position="center">
                    <Space h="md" />
                    <ThemeIcon radius="xl" size="xl" color="green">
                        <Check size={60} strokeWidth={2} color="white" />
                    </ThemeIcon>
                    <Space h="md" />
                    <Button onClick={async () => await Router.push("/auth/signin")}>
                        Anmeldung
                    </Button>
                </Group>
            )}
        </BodyShell>
    );
};

RequestPasswordReset.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default RequestPasswordReset;
