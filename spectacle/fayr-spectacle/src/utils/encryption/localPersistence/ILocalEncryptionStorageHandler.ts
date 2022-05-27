import { Store } from "~/models";

type StoreId = Store["id"];

export default interface ILocalEncryptionStorageHandler {
    storeSecret(rawSecret: CryptoKey, storeId: StoreId): Promise<void>;
    getSecret(storeId: StoreId): Promise<string | undefined>;
    hasSecret(storeId: StoreId): Promise<boolean>;
}
