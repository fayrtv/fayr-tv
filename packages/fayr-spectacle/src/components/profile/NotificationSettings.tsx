import Auth from "@aws-amplify/auth";
import { Alert, Container, Stack } from "@mantine/core";
import * as React from "react";
import { Check } from "tabler-icons-react";
import { User } from "~/types/user";
import { useProfileForm } from "./hooks/useProfileForm";

type Props = {
    user: User;
};

export const NotificationSettings = ({ user }: Props) => {
    const [success, setSuccess] = React.useState(false);

    const { onSubmit, profileComponents } = useProfileForm({
        initialValues: user,
        onSubmit: async ({ newsletter, newsletteremail }) => {
            setSuccess(false);
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentUser, {
                "custom:newsletter": String(newsletter),
                "custom:newsletteremail": String(newsletteremail),
            });
            setSuccess(true);
        },
        errorTitle: "Fehler beim Ändern der Benachrichtigungs-Email",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
    });

    return (
        <form onSubmit={onSubmit}>
            {success && (
                <Alert
                    mb="md"
                    // variant="filled"
                    icon={<Check size={16} />}
                    title="Änderungen gespeichert"
                    color="success"
                >
                    Ihre Änderungen wurden erfolgreich gespeichert
                </Alert>
            )}
            {profileComponents.renderError()}
            {profileComponents.renderLoadingOverlay()}
            <Stack>
                <Container size={400} px={0} m={0}>
                    {profileComponents.renderNewsletterEmailInput()}
                </Container>
                {profileComponents.renderNewsletterCheckbox()}
                <Container size={400} px={0} m={0}>
                    {profileComponents.renderSubmitButton("Speichern")}
                </Container>
            </Stack>
        </form>
    );
};

export default NotificationSettings;
