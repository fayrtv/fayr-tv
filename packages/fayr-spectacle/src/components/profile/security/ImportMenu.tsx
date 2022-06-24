import { Button, Group, Stack, ThemeIcon, Text, Textarea, Alert } from "@mantine/core";
import React from "react";
import { AlertCircle, AlertTriangle, FileImport } from "tabler-icons-react";
import { QRCodeReader } from "~/components/QRCodeReader";

type ImportModalProps = {
    keyAvailabilityChecker: () => Promise<boolean>;
    keySetter: (keyAsJson: any) => Promise<void>;
    closeModal(): void;
};

export const ImportMenu = ({ keyAvailabilityChecker, keySetter, closeModal }: ImportModalProps) => {
    enum View {
        ConfirmRisk,
        Import,
    }

    const [view, setView] = React.useState<View>(View.Import);
    const [manuallyEnteredKey, setManuallyEnteredKey] = React.useState("");
    const [importError, setImportError] = React.useState(false);

    React.useEffect(() => {
        const init = async () => {
            const hasExistingKey = await keyAvailabilityChecker();
            if (hasExistingKey) {
                setView(View.ConfirmRisk);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (view === View.ConfirmRisk) {
        return (
            <Stack>
                <Group direction="row" noWrap>
                    <ThemeIcon color="yellow" size="xl">
                        <AlertTriangle />
                    </ThemeIcon>
                    <span>
                        Auf diesem Gerät ist bereits ein existierendes Verschlüsselungsgeheimnis
                        vorhanden. Sollten sie ein neues Geheimnis importieren, um beispielsweise
                        verschiedene Geräte zu synchronisieren, so wird das alte Geheimnis
                        überschrieben. Importieren sie nur Daten von eigenen Geräten oder Personen
                        welchen sie vertrauen.
                    </span>
                </Group>
                <Button onClick={() => setView(View.Import)}>Weiter</Button>
            </Stack>
        );
    }

    const onImport = async (data: string) => {
        try {
            const jsonKey = JSON.parse(window.atob(data));
            await keySetter(jsonKey);
            closeModal();
        } catch (error) {
            setImportError(true);
            window.setTimeout(() => setImportError(false), 1000);
        }
    };

    return (
        <Stack align="center">
            <Group spacing="xs" grow direction="row" align="start">
                <Stack sx={() => ({ flexGrow: 2, padding: "5px" })} align="center">
                    <Text underline>Per QR-Code</Text>
                    <QRCodeReader onError={console.error} onScan={onImport} />
                </Stack>
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Manuell</Text>
                    <Text align="center">
                        Fügen sie hier den Schlüssel aus dem "Exportieren" Menü auf dem Quellgerät
                        ein
                    </Text>
                    <Textarea
                        autosize
                        sx={(_) => ({ width: "100%" })}
                        value={manuallyEnteredKey}
                        onChange={(event) => setManuallyEnteredKey(event.currentTarget.value)}
                    />
                    {importError ? (
                        <>
                            <ThemeIcon color="red" size="xl">
                                <AlertCircle />
                            </ThemeIcon>
                            <Alert icon={<AlertCircle size={16} />} title="Fehler!" color="red">
                                Das hat leider nicht wie gewünscht funktioniert.
                            </Alert>
                        </>
                    ) : (
                        <Button
                            leftIcon={<FileImport />}
                            onClick={() => onImport(manuallyEnteredKey)}
                        >
                            Importieren
                        </Button>
                    )}
                </Stack>
            </Group>
        </Stack>
    );
};
