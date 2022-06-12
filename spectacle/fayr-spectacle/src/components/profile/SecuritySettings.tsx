import {
    Alert,
    Button,
    Divider,
    Group,
    Modal,
    Popover,
    Stack,
    Text,
    Textarea,
    ThemeIcon,
} from "@mantine/core";
import * as React from "react";
import {
    AlertCircle,
    AlertTriangle,
    ArrowBarDown,
    ArrowBarUp,
    Check,
    Copy,
    FileImport,
} from "tabler-icons-react";
import { User } from "~/types/user";
import useEncryption from "~/hooks/useEncryption";
import ILocalEncryptionStorageHandler from "~/utils/encryption/localPersistence/ILocalEncryptionStorageHandler";
import { useStoreInfo } from "../StoreInfoProvider";
import { SerializedModel } from "~/models/amplify-models";
import { Store } from "~/models";
import { useAsyncState } from "~/hooks/useAsyncState";
import { QRCode } from "../QRCode";
import { useClipboard } from "@mantine/hooks";

type Props = {
    user: User;
};

enum ModalOperation {
    Import,
    Export,
}

type ModalProps = {
    store: SerializedModel<Store>;
    user: User;
    localEncryptionManager: ILocalEncryptionStorageHandler;
    closeModal(): void;
};

const ImportMenu = ({ user, store, localEncryptionManager, closeModal }: ModalProps) => {
    enum View {
        ConfirmRisk,
        Import,
    }

    const [view, setView] = React.useState<View>(View.Import);
    const [manuallyEnteredKey, setManuallyEnteredKey] = React.useState("");
    const [importError, setImportError] = React.useState(false);

    React.useEffect(() => {
        const init = async () => {
            const hasExistingKey = await localEncryptionManager.hasSecret(user.id, store.id);
            if (hasExistingKey) {
                setView(View.ConfirmRisk);
            }
        };
        init();
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

    return (
        <Stack align="center">
            <Group spacing="xs" grow direction="row" align="start">
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Per QR Code</Text>
                    TODO
                </Stack>
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Manuell</Text>
                    <Text>
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
                            onClick={async () => {
                                try {
                                    const jsonKey = JSON.parse(window.atob(manuallyEnteredKey));
                                    const exportedKey = await window.crypto.subtle.importKey(
                                        "jwk",
                                        jsonKey,
                                        "AES-GCM",
                                        true,
                                        ["encrypt", "decrypt"],
                                    );
                                    await localEncryptionManager.setSecret(
                                        exportedKey,
                                        user.id,
                                        store.id,
                                    );
                                    closeModal();
                                } catch (error) {
                                    setImportError(true);
                                    window.setTimeout(() => setImportError(false), 1000);
                                    console.log(error);
                                }
                            }}
                        >
                            Importieren
                        </Button>
                    )}
                </Stack>
            </Group>
        </Stack>
    );
};

const ExportMenu = ({ user, store, localEncryptionManager }: ModalProps) => {
    const clipboard = useClipboard();

    const [copied, setCopied] = React.useState(false);

    const [key, _, keyAvailable] = useAsyncState<string>(async () => {
        const rawSecret = (await localEncryptionManager.getSecret(user.id, store.id))!;
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        return window.btoa(JSON.stringify(exportedKey));
    });

    if (!keyAvailable) {
        return <p>Lade Schlüssel</p>;
    }

    return (
        <Stack align="center">
            <Group direction="row" noWrap>
                <ThemeIcon color="yellow" size="xl">
                    <AlertTriangle />
                </ThemeIcon>
                <span>
                    Um ihre per Ende-zu-Ende-Verschlüsselung gesicherten Protokolle auf anderen
                    Geräten einsehen zu können, müssen sie das gerätespezifische Geheimnis dort
                    erneut importieren. Übergeben sie diese Daten nur an Personen, denen sie
                    vertrauen!
                </span>
            </Group>
            <Group spacing="xs" grow direction="row" align="start">
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Per QR Code</Text>
                    <QRCode content={key!} />
                </Stack>
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Manuell</Text>
                    <Text>Kopieren sie diesen Text ins "Importieren" Menü auf dem Zielgerät</Text>
                    <Textarea autosize sx={(_) => ({ width: "100%" })}>
                        {key}
                    </Textarea>
                    {copied ? (
                        <ThemeIcon color="green" size="xl">
                            <Check />
                        </ThemeIcon>
                    ) : (
                        <Button
                            leftIcon={<Copy />}
                            onClick={() => {
                                clipboard.copy(key);
                                setCopied(true);
                                window.setTimeout(() => setCopied(false), 1000);
                            }}
                        >
                            Kopieren
                        </Button>
                    )}
                </Stack>
            </Group>
        </Stack>
    );
};

export const SecuritySettings = ({ user }: Props) => {
    const [modalOperation, setModalOperation] = React.useState<ModalOperation | undefined>();

    const { localEncryptionManager } = useEncryption();

    const storeInfo = useStoreInfo();

    return (
        <Stack>
            <Text>Verwalten sie hier ihre Sicherheitseinstellungen.</Text>
            <Group direction="row">
                <Text weight={600}>Verschlüsselungsinfo für ihren Brillenpass:</Text>
                <Button
                    leftIcon={<ArrowBarUp />}
                    onClick={() => setModalOperation(ModalOperation.Export)}
                >
                    Exportieren
                </Button>
                <Button
                    leftIcon={<ArrowBarDown />}
                    onClick={() => setModalOperation(ModalOperation.Import)}
                >
                    Importieren
                </Button>
            </Group>
            <Modal
                size="xl"
                centered
                opened={modalOperation !== undefined}
                onClose={() => setModalOperation(undefined)}
                title={modalOperation === ModalOperation.Export ? "Exportieren" : "Importieren"}
            >
                {modalOperation === ModalOperation.Export ? (
                    <ExportMenu
                        user={user}
                        localEncryptionManager={localEncryptionManager}
                        store={storeInfo}
                        closeModal={() => setModalOperation(undefined)}
                    />
                ) : (
                    <ImportMenu
                        user={user}
                        localEncryptionManager={localEncryptionManager}
                        store={storeInfo}
                        closeModal={() => setModalOperation(undefined)}
                    />
                )}
            </Modal>
        </Stack>
    );
};

export default SecuritySettings;
