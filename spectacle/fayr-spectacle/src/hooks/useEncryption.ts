import React from "react";
import AmplifyStoreKeyExchanger from "~/utils/encryption/exchange/AmplifyStoreKeyExchanger";
import IndexedDbStorageHandler from "~/utils/encryption/localPersistence/indexedDbStorageHandler";
import { EncryptionManager } from "~/utils/encryption/encryptionManager";

export default function useEncryption() {
    const encryptionmanager = React.useMemo(
        () => new EncryptionManager(new IndexedDbStorageHandler(), new AmplifyStoreKeyExchanger()),
        [],
    );

    return encryptionmanager;
}
