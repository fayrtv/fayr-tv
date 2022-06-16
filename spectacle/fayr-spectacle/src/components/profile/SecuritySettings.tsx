import {
    Alert,
    Button,
    Divider,
    Group,
    Loader,
    Modal,
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
    Rotate,
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
import { useSession } from "../../hooks/useSession";
import { IEncryptionManager } from "../../utils/encryption/encryptionManager";

type Props = {
    user: User;
};

enum ModalOperation {
    ImportSecret,
    ExportSecret,
    GenerateStorePair,
    ImportStoreKey,
    ExportStoreKey,
}

type ImportModalProps = {
    keyAvailabilityChecker: () => Promise<boolean>;
    keySetter: (keyAsJson: any) => Promise<void>;
    closeModal(): void;
};

const ImportMenu = ({ keyAvailabilityChecker, keySetter, closeModal }: ImportModalProps) => {
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
                                    await keySetter(jsonKey);
                                    closeModal();
                                } catch (error) {
                                    setImportError(true);
                                    window.setTimeout(() => setImportError(false), 1000);
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

type ExportModalProps = {
    // TODO: Figure out how to get this working with the apparently much longer RSA key. QR Code lib either throws "too long" or (when attempting to
    // compress with LZString) "Malformed"
    allowQrCode?: boolean;
    keyRetriever: () => Promise<CryptoKey>;
};

const ExportMenu = ({ allowQrCode = true, keyRetriever }: ExportModalProps) => {
    const clipboard = useClipboard();

    const [copied, setCopied] = React.useState(false);

    const [key, _, keyAvailable] = useAsyncState<string>(async () => {
        const rawSecret = await keyRetriever();
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
                {allowQrCode && (
                    <Stack sx={() => ({ flexGrow: 2 })} align="center">
                        <Text underline>Per QR Code</Text>
                        <QRCode content={key!} />
                    </Stack>
                )}
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

type GenerateModalProps = {
    store: SerializedModel<Store>;
    localEncryptionStorageHandler: ILocalEncryptionStorageHandler;
    encryptionManager: IEncryptionManager;
    closeModal(): void;
};

const GenerateStorePair = ({
    store,
    localEncryptionStorageHandler,
    encryptionManager,
    closeModal,
}: GenerateModalProps) => {
    const [loading, setLoading] = React.useState(false);

    const [keyAvailable, _, keyAvailabilityLoading] = useAsyncState<boolean>(
        async () => await localEncryptionStorageHandler.hasStorePrivateKey(store.id),
    );

    if (!keyAvailabilityLoading) {
        return <p>Lade...</p>;
    }

    const onClick = async () => {
        try {
            setLoading(true);
            await encryptionManager.createStoreKeyPair(store.id);
            closeModal();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack>
            <Text>
                Hier können sie einen Schlüssel für ihr ZEISS VISION CENTER generieren. Um die
                Sicherheit ihrer Daten zu gewähren, ist der Schlüssel nur für das Erstellen von
                Refraktionsprotokollen auf diesem Gerät gültig, kann aber auf anderen Geräten
                importiert werden.
            </Text>
            {keyAvailable && (
                <Group direction="row" noWrap>
                    <ThemeIcon color="yellow" size="xl">
                        <AlertTriangle />
                    </ThemeIcon>
                    <span>
                        Für dieses ZEISS VISION CENTER ist bereits ein Schlüsselpaar eingerichtet.
                        Wenn ein neues Paar generiert wird, werden bestehende Informationen
                        überschrieben. Sind sie sich sicher, dass sie ein neues Geheimnis generieren
                        wollen?
                    </span>
                </Group>
            )}
            {loading ? (
                <Loader />
            ) : (
                <Button leftIcon={<Rotate />} onClick={onClick}>
                    Generieren
                </Button>
            )}
        </Stack>
    );
};

export const SecuritySettings = ({ user }: Props) => {
    const [modalOperation, setModalOperation] = React.useState<ModalOperation | undefined>(
        undefined,
    );

    const { isAdmin } = useSession();

    const { encryptionManager, localEncryptionManager } = useEncryption();

    const storeInfo = useStoreInfo();
    const closeModal = () => setModalOperation(undefined);

    const modalContent = React.useMemo(() => {
        let content: React.ReactNode | null = null;

        switch (modalOperation) {
            case ModalOperation.ExportSecret:
                content = (
                    <ExportMenu
                        keyRetriever={async () =>
                            (await localEncryptionManager.getSecret(user.id, storeInfo.id))!
                        }
                    />
                );
                break;
            case ModalOperation.ImportSecret:
                content = (
                    <ImportMenu
                        closeModal={closeModal}
                        keyAvailabilityChecker={async () =>
                            await localEncryptionManager.hasSecret(user.id, storeInfo.id)
                        }
                        keySetter={async (keyAsJson: any) => {
                            const importedKey = await window.crypto.subtle.importKey(
                                "jwk",
                                keyAsJson,
                                "AES-GCM",
                                true,
                                ["encrypt", "decrypt"],
                            );
                            await localEncryptionManager.setSecret(
                                importedKey,
                                user.id,
                                storeInfo.id,
                            );
                        }}
                    />
                );
                break;
            case ModalOperation.GenerateStorePair:
                content = (
                    <GenerateStorePair
                        encryptionManager={encryptionManager}
                        localEncryptionStorageHandler={localEncryptionManager}
                        store={storeInfo}
                        closeModal={closeModal}
                    />
                );
                break;
            case ModalOperation.ImportStoreKey:
                content = (
                    <ImportMenu
                        closeModal={closeModal}
                        keyAvailabilityChecker={async () =>
                            await localEncryptionManager.hasStorePrivateKey(storeInfo.id)
                        }
                        keySetter={async (keyAsJson: any) => {
                            const importedKey = await window.crypto.subtle.importKey(
                                "jwk",
                                keyAsJson,
                                { name: "RSA-OAEP", hash: { name: "SHA-256" } },
                                true,
                                ["decrypt"],
                            );
                            await localEncryptionManager.setStorePrivateKey(
                                importedKey,
                                storeInfo.id,
                            );
                        }}
                    />
                );
                break;
            case ModalOperation.ExportStoreKey:
                content = (
                    <ExportMenu
                        allowQrCode={false}
                        keyRetriever={async () =>
                            (await localEncryptionManager.getStorePrivateKey(storeInfo.id))!
                        }
                    />
                );
                break;
        }

        return content;
    }, [modalOperation]);

    return (
        <Stack>
            <Text>Verwalten sie hier ihre persönlichen Sicherheitseinstellungen.</Text>
            <Group direction="row">
                <Text weight={600}>Verschlüsselungsinfo für ihren Brillenpass:</Text>
                <Button
                    leftIcon={<ArrowBarUp />}
                    onClick={() => setModalOperation(ModalOperation.ExportSecret)}
                >
                    Exportieren
                </Button>
                <Button
                    leftIcon={<ArrowBarDown />}
                    onClick={() => setModalOperation(ModalOperation.ImportSecret)}
                >
                    Importieren
                </Button>
            </Group>
            {isAdmin && (
                <>
                    <Divider orientation="horizontal" />
                    <Text>
                        Verwalten sie hier ihre Sicherheitseinstellungen für ihr ZEISS VISION
                        CENTER.
                    </Text>
                    <Group direction="row">
                        <Text weight={600}>Verschlüsselungsinfo für ihr ZEISS VISION CENTER:</Text>
                        <Button
                            leftIcon={<Rotate />}
                            onClick={() => setModalOperation(ModalOperation.GenerateStorePair)}
                        >
                            Generieren
                        </Button>
                        <Button
                            leftIcon={<ArrowBarUp />}
                            onClick={() => setModalOperation(ModalOperation.ExportStoreKey)}
                        >
                            Exportieren
                        </Button>
                        <Button
                            leftIcon={<ArrowBarDown />}
                            onClick={() => setModalOperation(ModalOperation.ImportStoreKey)}
                        >
                            Importieren
                        </Button>
                    </Group>
                </>
            )}
            <Modal
                size="xl"
                centered
                opened={modalOperation !== undefined}
                onClose={() => setModalOperation(undefined)}
                title={
                    modalOperation === ModalOperation.GenerateStorePair
                        ? "Generieren"
                        : modalOperation === ModalOperation.ExportStoreKey ||
                          modalOperation === ModalOperation.ExportSecret
                        ? "Exportieren"
                        : "Importieren"
                }
            >
                {modalContent}
            </Modal>
        </Stack>
    );
};

export default SecuritySettings;
