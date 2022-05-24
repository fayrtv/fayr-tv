import React, { useState } from "react";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { Alert, Group, PasswordInput, Stack } from "@mantine/core";
import { Auth } from "aws-amplify";
import { Check } from "tabler-icons-react";
import { useInputState } from "@mantine/hooks";

const ChangePassword = () => {
    const [success, setSuccess] = useState(false);
    const [oldPassword, setOldPassword] = useInputState("");

    const { onSubmit, ProfileForm } = useProfileForm({
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
                <ProfileForm.Error />
                <ProfileForm.LoadingOverlay />

                <Stack spacing="lg">
                    <PasswordInput
                        required
                        label="Aktuelles Passwort"
                        value={oldPassword}
                        sx={{ minWidth: "230px" }}
                        onChange={setOldPassword}
                    />
                    <Stack spacing="sm">
                        <ProfileForm.Password label="Neues Passwort" />
                        <ProfileForm.ConfirmPassword />
                    </Stack>
                </Stack>

                <Group position="right" mt="md">
                    <ProfileForm.SubmitButton caption="Neues Passwort" />
                </Group>
            </form>
        </>
    );
};

export default ChangePassword;
