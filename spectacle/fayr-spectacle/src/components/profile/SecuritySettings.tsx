import { Button, Divider, Group, Modal, Stack, Text, Textarea, ThemeIcon } from "@mantine/core";
import * as React from "react";
import { AlertTriangle, ArrowBarDown, ArrowBarUp, Check, Copy } from "tabler-icons-react";
import { User } from "~/types/user";
import useEncryption from "~/hooks/useEncryption";
import ILocalEncryptionStorageHandler from "~/utils/encryption/localPersistence/ILocalEncryptionStorageHandler";
import { useStoreInfo } from "../StoreInfoProvider";
import { SerializedModel } from "~/models/amplify-models";
import { Store } from "~/models";
import useAsyncState from "~/hooks/useAsyncState";
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
};

const ImportMenu = ({ user, store, localEncryptionManager }: ModalProps) => {
    return <Group direction="row"></Group>;
};

const ExportMenu = ({ user, store, localEncryptionManager }: ModalProps) => {
    const clipboard = useClipboard();

    const [copied, setCopied] = React.useState(false);

    const keyState = useAsyncState<string>(async () => {
        const rawSecret = (await localEncryptionManager.getSecret(user.id, store.id))!;
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        return window.btoa(JSON.stringify(exportedKey));
    });

    if (keyState.loading) {
        return <p>Lade Schlüssel</p>;
    }

    const key = keyState.state;

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
                    <QRCode content={key} />
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
                    />
                ) : (
                    <ImportMenu
                        user={user}
                        localEncryptionManager={localEncryptionManager}
                        store={storeInfo}
                    />
                )}
            </Modal>
        </Stack>
    );
};

export default SecuritySettings;
