import { Button, Container, Group, Paper, Space, Stack, Text, Textarea } from "@mantine/core";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useState } from "react";
import { useInputState } from "@mantine/hooks";

// https://day.js.org/docs/en/plugin/localized-format
dayjs.extend(localizedFormat);
dayjs.locale("de");

type Props = {
    begin: Date;
    end: Date;
    onCancel: () => void;
    onConfirm: (begin: Date, end: Date, message: string) => Promise<void>;
};

const ConfirmAppointment = ({ begin, end, onCancel, onConfirm }: Props) => {
    const { name, city, fullAddress } = useStoreInfo();
    const [message, setMessage] = useInputState("");

    return (
        <Container size="xs">
            <Stack spacing="xs" mt="md">
                <Text weight="bold" size="md">
                    Ihr Termin im Überblick
                </Text>
                <Paper shadow="xs" px="md" py="sm" mt="sm" mb="sm">
                    <Text color="gray" sx={{ userSelect: "all" }}>
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

                {/* TODO: Once submission works, use proper form submit */}
                <form onSubmit={() => void 0}>
                    <Textarea
                        value={message}
                        onChange={setMessage}
                        mt="md"
                        placeholder="Ihre Nachricht..."
                        label="Möchten Sie uns noch etwas mitteilen?"
                        autosize
                    />
                    <Space h="md" />
                    <Group spacing="sm" position="apart">
                        <Button color="danger" onClick={onCancel}>
                            Zurück
                        </Button>
                        <Button
                            color="success"
                            onClick={async () => await onConfirm(begin, end, message)}
                        >
                            Bestätigen
                        </Button>
                    </Group>
                </form>
            </Stack>
        </Container>
    );
};

export default ConfirmAppointment;
