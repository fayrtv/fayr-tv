import { Button, Text } from "@mantine/core";
import { Center, Container, Group, Paper, Space, Stack, Textarea } from "@mantine/core";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { InfoBox } from "~/components/appointment/InfoBox";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

// https://day.js.org/docs/en/plugin/localized-format
dayjs.extend(localizedFormat);
dayjs.locale("de");

type Props = {
    begin: Date;
    end: Date;
    onCancel: () => void;
    onConfirm: (begin: Date, end: Date) => void;
};

const ConfirmAppointment = ({ begin, end, onCancel }: Props) => {
    const { name, city, fullAddress } = useStoreInfo();

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

                <form>
                    <Textarea
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
                        <Button type="submit" color="success">
                            Bestätigen
                        </Button>
                    </Group>
                </form>
            </Stack>
        </Container>
    );
};

export default ConfirmAppointment;
