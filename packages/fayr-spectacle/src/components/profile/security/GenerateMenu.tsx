import { Group, Stack, ThemeIcon, Text, Button, Loader } from "@mantine/core";
import React from "react";
import { AlertTriangle, Rotate } from "tabler-icons-react";
import { useAsyncState } from "~/hooks/useAsyncState";
import { Store } from "~/models";
import { SerializedModel } from "~/models/amplify-models";
import { User } from "~/types/user";
import { IEncryptionManager } from "~/utils/encryption/encryptionManager";
import ILocalEncryptionStorageHandler from "~/utils/encryption/localPersistence/ILocalEncryptionStorageHandler";

type GenerateModalProps = {
    store: SerializedModel<Store>;
    localEncryptionStorageHandler: ILocalEncryptionStorageHandler;
    encryptionManager: IEncryptionManager;
    closeModal(): void;
};

export const GenerateStorePair = ({
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

export const GenerateSecret = ({
    user,
    store,
    localEncryptionStorageHandler,
    encryptionManager,
    closeModal,
}: GenerateModalProps & {
    user: User;
}) => {
    const [loading, setLoading] = React.useState(false);

    const [keyAvailable, _, keyAvailabilityLoading] = useAsyncState<boolean>(
        async () => await localEncryptionStorageHandler.hasSecret(user.id, store.id),
    );

    if (!keyAvailabilityLoading) {
        return <p>Lade...</p>;
    }

    const onClick = async () => {
        try {
            setLoading(true);
            await encryptionManager.setupDeviceSecret(user.id, store.id);
            closeModal();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack>
            <Text>
                Hier können sie ein neues Schlüsselpaar für ihre Daten generieren. Um die Sicherheit
                ihrer Daten zu gewähren, ist der Schlüssel nur für das Erstellen von
                Refraktionsprotokollen auf diesem Gerät gültig, kann aber auf anderen Geräten
                importiert werden.
            </Text>
            {keyAvailable && (
                <Group direction="row" noWrap>
                    <ThemeIcon color="yellow" size="xl">
                        <AlertTriangle />
                    </ThemeIcon>
                    <span>
                        Für diesen Account ist bereits ein Schlüsselpaar eingerichtet. Wenn ein
                        neues Paar generiert wird, werden bestehende Informationen überschrieben,
                        und alle Refraktionsprotokolle sind nicht mehr verfügbar. Sind sie sich
                        sicher, dass sie ein neues Geheimnis generieren wollen?
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
