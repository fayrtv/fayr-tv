import React, { useState } from "react";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { Alert, Button, Grid, Group, PasswordInput, Stack } from "~/components/common";
import { Auth } from "aws-amplify";
import Router from "next/router";
import { User } from "~/types/user";
import { AlertCircle, Check } from "tabler-icons-react";

type Props = { user: User };

const ChangePassword = ({ user }: Props) => {
    const [success, setSuccess] = useState(false);
    const [oldPassword, setOldPassword] = useState("");

    const {
        onSubmit,
        renderError,
        renderLoadingOverlay,
        renderPasswordInput,
        renderConfirmPasswordInput,
        renderSubmitButton,
    } = useProfileForm({
        onSubmit: async ({ password }) => {
            setSuccess(false);
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(currentUser, oldPassword, password);
            setSuccess(true);
        },
        errorTitle: "Fehler beim Ändern des Passworts",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
    });

    return (
        <>
            <form onSubmit={onSubmit}>
                {success && (
                    <Alert
                        mb="md"
                        // variant="filled"
                        icon={<Check size={16} />}
                        title="Passwort geändert"
                        color="success"
                    >
                        Ihr neues Passwort wurde erfolgreich festgelegt.
                    </Alert>
                )}
                {renderError()}
                {renderLoadingOverlay()}

                <Stack spacing="lg">
                    <PasswordInput
                        required
                        label="Aktuelles Passwort"
                        value={oldPassword}
                        sx={{ minWidth: "230px" }}
                        onChange={(ev) => setOldPassword(ev.target.value)}
                    />
                    <Stack spacing="sm">
                        {renderPasswordInput("Neues Passwort")}
                        {renderConfirmPasswordInput()}
                    </Stack>
                </Stack>

                <Group position="right" mt="md">
                    {renderSubmitButton("Speichern")}
                </Group>
            </form>
        </>
    );
};

export default ChangePassword;
