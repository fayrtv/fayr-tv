import AmplifyStoreKeyExchanger from "~/utils/encryption/exchange/AmplifyStoreKeyExchanger";
import IndexedDbStorageHandler from "~/utils/encryption/localPersistence/indexedDbStorageHandler";
import { EncryptionManager } from "~/utils/encryption/encryptionManager";

const encryptionManager = new EncryptionManager(
    new IndexedDbStorageHandler(),
    new AmplifyStoreKeyExchanger(),
);

export default function useEncryption() {
    return encryptionManager;
}
