import {
    Alert,
    Box,
    Button,
    Container,
    Group,
    LoadingOverlay,
    Paper,
    Space,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useState } from "react";
import { useInputState } from "@mantine/hooks";
import { useProfileForm } from "~/components/profile/hooks/useProfileForm";
import { useSession } from "~/hooks/useSession";
import { Appointment } from "~/models";
import { DataStore } from "@aws-amplify/datastore";
import { CreateAppointment } from "~/pages/api/appointments/[[...params]]";
import { useError } from "~/hooks/useError";
import { Check } from "tabler-icons-react";

// https://day.js.org/docs/en/plugin/localized-format
dayjs.extend(localizedFormat);
dayjs.locale("de");

type Props = {
    begin: Date;
    end: Date;
    onCancel: () => void;
};

const ConfirmAppointment = ({ begin, end, onCancel }: Props) => {
    const { isAuthenticated } = useSession();
    const [success, setSuccess] = useState(false);
    const { name, city, fullAddress, id: storeID } = useStoreInfo();
    const {
        onSubmit,
        isSubmitting,
        profileComponents: {
            renderAddressSelection,
            renderFirstNameInput,
            renderLastNameInput,
            renderTitleInput,
            renderPhoneInput,
            renderEmailInput,
            renderError,
        },
    } = useProfileForm({
        errorTitle: "Leider konnten wir Ihren Termin nicht bestätigen.",
        onSubmit: async (userProfile, setError) => {
            const payload: CreateAppointment = {
                atStoreID: storeID,
                beginDate: begin.toISOString(),
                endDate: end.toISOString(),
                message: message,
            };

            if (!isAuthenticated) {
                payload.anonymousCustomer = {
                    address: userProfile.address,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    phone: userProfile.phone,
                    title: userProfile.title,
                    email: userProfile.email,
                };
            }

            const response = await fetch("/api/appointments", {
                method: "POST",
                credentials: isAuthenticated ? "include" : "omit",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                setError("Ein unerwarteter Fehler ist aufgetreten");
            }
        },
    });
    const [message, setMessage] = useInputState("");

    return (
        <Container size="xs">
            <Stack spacing="xs" mt="md">
                <Text weight="bold" size="md">
                    Ihr Termin im Überblick
                </Text>
                <Paper shadow="xs" px="md" py="sm" mt="sm" mb="sm">
                    <Text sx={(theme) => ({ userSelect: "all" })} color="gray">
                        {name} {city}
                    </Text>
                    <Text color="gray" sx={{ userSelect: "all" }}>
                        {fullAddress}
                    </Text>
                </Paper>
                <Group spacing="sm">
                    {/* https://day.js.org/docs/en/display/format */}
                    <InfoBox>{dayjs(begin).format("dddd")}</InfoBox>
                    <InfoBox>{dayjs(begin).format("ll")}</InfoBox>
                    <InfoBox>
                        {dayjs(begin).format("LT")} - {dayjs(end).format("LT")}
                    </InfoBox>
                </Group>
                <Text size="xxxs" color="gray">
                    Hinweis: Alle Zeiten werden für Berlin - CEST [GMT+02:00] angezeigt.
                </Text>

                <Box mt="md">
                    {success ? (
                        <Alert
                            // variant="filled"
                            icon={<Check size={16} />}
                            title="Termin bestätigt"
                            color="success"
                        >
                            Vielen Dank. Ihr Termin wurde bestätigt.
                            <br />
                            Sie erhalten weitere Informationen an Ihre E-Mail Adresse.
                        </Alert>
                    ) : (
                        <form method="POST" onSubmit={onSubmit}>
                            <LoadingOverlay visible={isSubmitting} />
                            {!isAuthenticated && (
                                <>
                                    <Stack spacing="sm">
                                        <Group grow>
                                            {renderAddressSelection()}
                                            {renderTitleInput()}
                                        </Group>
                                        {renderFirstNameInput()}
                                        {renderLastNameInput()}
                                        {renderEmailInput()}
                                        {renderPhoneInput()}
                                    </Stack>
                                </>
                            )}
                            <Textarea
                                value={message}
                                onChange={setMessage}
                                mt="md"
                                placeholder="Ihre Nachricht..."
                                label="Möchten Sie uns noch etwas mitteilen?"
                                autosize
                            />
                            <Space h="md" />
                            {renderError()}
                            <Group spacing="sm" position="apart">
                                <Button color="danger" onClick={onCancel}>
                                    Zurück
                                </Button>
                                <Button type="submit" color="success">
                                    Bestätigen
                                </Button>
                            </Group>
                        </form>
                    )}
                </Box>
            </Stack>
        </Container>
    );
};

export default ConfirmAppointment;
