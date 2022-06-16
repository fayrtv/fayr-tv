import React, { useState } from "react";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { Alert, Group, PasswordInput, Stack } from "@mantine/core";
import { Auth } from "aws-amplify";
import { Check } from "tabler-icons-react";
import { useInputState } from "@mantine/hooks";

const ChangePassword = () => {
    const [success, setSuccess] = useState(false);
    const [oldPassword, setOldPassword] = useInputState("");

    const { onSubmit, profileComponents } = useProfileForm({
        onSubmit: async ({ password }) => {
            setSuccess(false);
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(currentUser, oldPassword, password);
            setSuccess(true);
        },
        errorTitle: "Fehler beim Ändern des Passworts",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
        validate: {
            confirmPassword: (passwordValue, profileFormData) =>
                passwordValue !== profileFormData.password
                    ? "Passwörter stimmen nicht überein"
                    : null,
        },
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
                {profileComponents.renderError()}
                {profileComponents.renderLoadingOverlay()}

                <Stack spacing="lg">
                    <PasswordInput
                        required
                        label="Aktuelles Passwort"
                        value={oldPassword}
                        sx={{ minWidth: "230px" }}
                        onChange={setOldPassword}
                    />
                    <Stack spacing="sm">
                        {profileComponents.renderPasswordInput("Neues Passwort")}
                        {profileComponents.renderConfirmPasswordInput()}
                    </Stack>
                </Stack>

                <Group position="right" mt="md">
                    {profileComponents.renderSubmitButton("Speichern")}
                </Group>
            </form>
        </>
    );
};

export default ChangePassword;
