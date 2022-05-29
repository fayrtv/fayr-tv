import { get, set } from "idb-keyval";
import { Store } from "~/models";
import { User } from "~/types/user";
import ILocalEncryptionStorageHandler from "./ILocalEncryptionStorageHandler";

export default class IndexedDbStorageHandler implements ILocalEncryptionStorageHandler {
    public async storeSecret(rawSecret: CryptoKey, userId: User["id"], storeId: Store["id"]) {
        const idbKey = this.createKey(userId, storeId);
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        await set(idbKey, JSON.stringify(exportedKey));
    }

    public async getSecret(
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<CryptoKey | undefined> {
        const idbKey = this.createKey(userId, storeId);
        const rawKey = await get<string>(idbKey);

        const importedKey = await window.crypto.subtle.importKey(
            "jwk",
            JSON.parse(rawKey!),
            "AES-GCM",
            true,
            ["encrypt", "decrypt"],
        );

        return importedKey;
    }

    public async hasSecret(userId: User["id"], storeId: Store["id"]): Promise<boolean> {
        const idbKey = this.createKey(userId, storeId);
        const rawKey = await get<string>(idbKey);
        return rawKey !== undefined;
    }

    private createKey(userId: User["id"], storeId: Store["id"]): string {
        return `${userId}_${storeId}`;
    }
}
