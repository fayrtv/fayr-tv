import AmplifyStoreKeyExchanger from "~/utils/encryption/exchange/AmplifyStoreKeyExchanger";
import IndexedDbStorageHandler from "~/utils/encryption/localPersistence/indexedDbStorageHandler";
import { EncryptionManager } from "~/utils/encryption/encryptionManager";

const localEncryptionManager = new IndexedDbStorageHandler();

const encryptionManager = new EncryptionManager(
    localEncryptionManager,
    new AmplifyStoreKeyExchanger(),
);

export default function useEncryption() {
    return { encryptionManager, localEncryptionManager };
}
