import AmplifyStoreKeyExchanger from "~/utils/encryption/exchange/AmplifyStoreKeyExchanger";
import IndexedDbStorageHandler from "~/utils/encryption/localPersistence/indexedDbStorageHandler";
import { EncryptionManager, IEncryptionManager } from "~/utils/encryption/encryptionManager";
import React from "react";

const globalLocalEncryptionManager = new IndexedDbStorageHandler();

let globalEncryptionManager: IEncryptionManager | undefined = undefined;

export default function useEncryption() {
    const encryptionManager = React.useMemo<IEncryptionManager>(() => {
        if (globalEncryptionManager) {
            return globalEncryptionManager;
        }

        globalEncryptionManager = new EncryptionManager(
            globalLocalEncryptionManager,
            new AmplifyStoreKeyExchanger(),
        );

        return globalEncryptionManager;
    }, []);

    return { encryptionManager, localEncryptionManager: globalLocalEncryptionManager };
}
