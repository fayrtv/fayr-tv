// Framework
import Auth from "@aws-amplify/auth";
import { Container, Paper, Stack, Text } from "@mantine/core";
import * as React from "react";
import { User } from "~/types/user";
import { useProfileForm } from "./hooks/useProfileForm";

type Props = {
    user: User;
};

export const NotificationSettings = ({ user }: Props) => {
    const [success, setSuccess] = React.useState(false);

    const {
        onSubmit,
        renderError,
        renderLoadingOverlay,
        renderNewsletterCheckbox,
        renderNewsletterEmailInput,
        renderSubmitButton,
    } = useProfileForm({
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
        <Paper p="xl" withBorder>
            <form onSubmit={onSubmit}>
                {renderError()}
                {renderLoadingOverlay()}
                <Stack>
                    <Text color="primary" size="xl" weight="bold">
                        Benachrichtigungen
                    </Text>
                    <Container size={400} px={0} m={0}>
                        {renderNewsletterEmailInput()}
                    </Container>
                    {renderNewsletterCheckbox()}
                    <Container size={400} px={0} m={0}>
                        {renderSubmitButton("Speichern")}
                    </Container>
                </Stack>
            </form>
        </Paper>
    );
};

export default NotificationSettings;