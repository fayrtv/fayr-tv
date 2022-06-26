import React, { useEffect, useRef, useState } from "react";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { Box, Button, Center, Divider, Grid, Group, Modal, Paper, Stack } from "@mantine/core";
import { Auth } from "aws-amplify";
import { User } from "~/types/user";
import { QRCode } from "~/components/QRCode";
import { Ruler } from "tabler-icons-react";
import { useElementSize } from "@mantine/hooks";
import { useHydrate } from "react-query";

type Props = { user: User };

const EditProfile = ({ user }: Props) => {
    const [isEditable, setEditable] = useState(false);
    const [showQRFullscreen, setShowQRFullscreen] = useState(false);

    const { onSubmit, profileComponents } = useProfileForm({
        isEditable: isEditable,
        initialValues: user,
        onSubmit: async ({ address, firstName, title, lastName, newsletter, city, phone }) => {
            const currentUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentUser, {
                family_name: lastName,
                "custom:address": address,
                "custom:first_name": firstName,
                "custom:title": title ?? "",
                "custom:newsletter": String(newsletter),
                "custom:city": city ?? "",
                "custom:phone": phone ?? "",
            });
            setEditable(false);
        },
        errorTitle: "Fehler beim Einloggen",
        errorToString: (error) => String(error).replace(/^.*Exception: /, ""),
    });

    return (
        <>
            <form onSubmit={onSubmit}>
                {profileComponents.renderError()}
                {profileComponents.renderLoadingOverlay()}
                <Grid gutter="md">
                    <Grid.Col sm={6}>
                        <Stack spacing="sm">
                            <Group grow>
                                {profileComponents.renderAddressSelection()}
                                {profileComponents.renderTitleInput()}
                            </Group>
                            {profileComponents.renderFirstNameInput()}
                            {profileComponents.renderLastNameInput()}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col sm={6}>
                        <Stack spacing="sm">
                            {profileComponents.renderEmailInput()}
                            {profileComponents.renderCityInput()}
                            {profileComponents.renderPhoneInput()}
                        </Stack>
                    </Grid.Col>
                </Grid>

                <Group position="right" mt="md">
                    {/* Do not combine into a ternary statement as the button will be treated as
                    submit button when switched */}
                    {isEditable && profileComponents.renderSubmitButton("Speichern")}
                    {!isEditable && <Button onClick={() => setEditable(true)}>Bearbeiten</Button>}
                </Group>

                <Divider my="lg" />
                <Modal opened={showQRFullscreen} onClose={() => setShowQRFullscreen(false)}>
                    <Center>
                        <QRCode content={user.email} width={300} height={300} />
                    </Center>
                </Modal>
                <Stack align="center" spacing="sm" sx={{ textAlign: "center" }}>
                    Mit diesem QR-Code kann Ihr Optiker Ihnen einen Brillenpass ausstellen:
                    <Box onClick={() => setShowQRFullscreen(true)}>
                        <QRCode content={user.email} width={140} height={140} />
                    </Box>
                </Stack>
            </form>
        </>
    );
};

export default EditProfile;
