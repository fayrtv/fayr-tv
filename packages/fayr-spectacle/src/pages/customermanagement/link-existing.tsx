import { NextPageWithLayout } from "~/types/next-types";
import { Button, Divider, Modal, Paper, Stack, Text, TextInput } from "@mantine/core";
import Layout from "~/components/layout/Layout";
import { useForm } from "@mantine/form";
import MainContainer from "~/components/layout/MainContainer";
import { LinkExistingCustomerRequest } from "~/pages/api/customers/link-existing";
import { useError } from "~/hooks/useError";
import { useRouter } from "next/router";
import { Qrcode } from "tabler-icons-react";
import { ShowProfile } from "~/components/layout/ShowProfile";
import { useState } from "react";
import { QRCodeReader } from "~/components/QRCodeReader";
import { validateEmail } from "~/pages/auth/signup";

const LinkExistingCustomerPage: NextPageWithLayout = () => {
    const { push } = useRouter();

    const [isQRCodeReaderOpen, setQRCodeReaderOpen] = useState(false);
    const [qrCodeData, setQRCodeData] = useState<string | undefined>(undefined);

    const { setError, renderError } = useError({
        title: "Konnte diesen Nutzer nicht hinzufügen.",
    });
    const form = useForm({
        initialValues: {
            userEmail: "",
        },
        validate: {
            userEmail: (value) => (validateEmail(value) ? null : "Ungültige E-Mail Adresse"),
        },
    });

    const onSubmit = async ({ userEmail }: { userEmail: string }) => {
        setError(null);
        const payload: LinkExistingCustomerRequest = { userEmail };
        const response = await fetch("/api/customers/link-existing", {
            body: JSON.stringify(payload),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            setError(
                response.status === 409
                    ? "Dieser Nutzer ist bereits ein Kunde Ihrer Filiale."
                    : response.status === 404
                    ? "Es existiert kein Nutzer mit dieser E-Mail Adresse."
                    : response.statusText,
            );
            return;
        }
        await push("/customermanagement");
    };

    return (
        <MainContainer
            crumbs={[
                { title: "Kundenverwaltung", href: "/customermanagement" },
                { title: "Konto verknüpfen" },
            ]}
        >
            <Modal
                opened={isQRCodeReaderOpen}
                onClose={() => {
                    setQRCodeReaderOpen(false);
                    setQRCodeData(undefined);
                }}
                title="QR-Code scannen"
            >
                {qrCodeData ? (
                    <>
                        {renderError()}
                        <form onSubmit={form.onSubmit(onSubmit)}>
                            <Stack spacing="sm" align="flex-start">
                                <TextInput
                                    {...form.getInputProps("userEmail")}
                                    label="E-Mail Adresse des Nutzers"
                                    sx={{ minWidth: 300 }}
                                />

                                <Button type="submit">Verlinken</Button>
                            </Stack>
                        </form>
                    </>
                ) : (
                    <QRCodeReader
                        onError={console.error}
                        onScan={async (data) => {
                            setQRCodeData(data);
                            form.setValues((state) => ({ ...state, userEmail: data }));
                        }}
                    />
                )}
            </Modal>
            <Stack align="flex-start" sx={{ width: "fit-content" }}>
                <Text size="xl" color="primary" weight="bold">
                    Bestehenden Nutzer als Kunden hinzufügen
                </Text>
                <Paper shadow="xs" p="md">
                    {renderError()}
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Stack spacing="sm" align="flex-start">
                            <TextInput
                                {...form.getInputProps("userEmail")}
                                label="E-Mail Adresse des Nutzers"
                                sx={{ minWidth: 300 }}
                            />

                            <Button type="submit">Verlinken</Button>
                        </Stack>
                    </form>
                </Paper>
                <Divider
                    my="sm"
                    label="oder"
                    variant="dashed"
                    labelPosition="center"
                    sx={{ alignSelf: "stretch" }}
                />
                <Paper shadow="xs" p="md">
                    <Stack spacing="sm" align="flex-start">
                        <Button
                            leftIcon={<Qrcode />}
                            onClick={() => setQRCodeReaderOpen(true)}
                            mb="sm"
                        >
                            Via QR-Code hinzufügen
                        </Button>
                        Bitten Sie den Kunden, sich einzuloggen und anschließend zur Profilansicht
                        zu navigieren:
                        <ShowProfile
                            shouldLink={false}
                            user={{ title: undefined, lastName: "Mustermann", address: "m" }}
                        />
                        Dort wird der QR-Code angezeigt, welchen Sie im nächsten Schritt abscannen
                        können.
                    </Stack>
                </Paper>
            </Stack>
        </MainContainer>
    );
};

LinkExistingCustomerPage.layoutProps = {
    Layout: Layout,
};

export default LinkExistingCustomerPage;
