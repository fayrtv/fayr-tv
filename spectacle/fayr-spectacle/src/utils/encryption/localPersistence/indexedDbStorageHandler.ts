import { get, set } from "idb-keyval";
import ILocalEncryptionStorageHandler from "./ILocalEncryptionStorageHandler";

export default class IndexedDbStorageHandler implements ILocalEncryptionStorageHandler {
    public async storeSecret(rawSecret: CryptoKey, storeId: string) {
        await set(storeId, rawSecret);
    }

    public async getSecret(storeId: string): Promise<string | undefined> {
        return await get<string>(storeId);
    }

    public async hasSecret(storeId: string): Promise<boolean> {
        return (await this.getSecret(storeId)) !== undefined;
    }
}
