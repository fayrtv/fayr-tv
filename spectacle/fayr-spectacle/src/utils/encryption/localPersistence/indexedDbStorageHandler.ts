import { get, set } from "idb-keyval";
import { Store } from "~/models";
import { User } from "~/types/user";
import ILocalEncryptionStorageHandler from "./ILocalEncryptionStorageHandler";

export default class IndexedDbStorageHandler implements ILocalEncryptionStorageHandler {
    public async setSecret(rawSecret: CryptoKey, userId: User["id"], storeId: Store["id"]) {
        const idbKey = IndexedDbStorageHandler.createKey(userId, storeId);
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        await set(idbKey, JSON.stringify(exportedKey));
    }

    public async getSecret(
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<CryptoKey | undefined> {
        const idbKey = IndexedDbStorageHandler.createKey(userId, storeId);
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
        const idbKey = IndexedDbStorageHandler.createKey(userId, storeId);
        const rawKey = await get<string>(idbKey);
        return rawKey !== undefined;
    }

    public async setStorePrivateKey(rawSecret: CryptoKey, storeId: string): Promise<void> {
        const idbKey = IndexedDbStorageHandler.createStoreKey(storeId);
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        await set(idbKey, JSON.stringify(exportedKey));
    }

    public async getStorePrivateKey(storeId: string): Promise<CryptoKey | undefined> {
        const idbKey = IndexedDbStorageHandler.createStoreKey(storeId);
        const rawKey = await get<string>(idbKey);

        const importedKey = await window.crypto.subtle.importKey(
            "jwk",
            JSON.parse(rawKey!),
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            // This is only for decryption, since we only deal with the private key here
            ["decrypt"],
        );

        return importedKey;
    }

    public async hasStorePrivateKey(storeId: string): Promise<boolean> {
        const idbKey = IndexedDbStorageHandler.createStoreKey(storeId);
        const rawKey = await get<string>(idbKey);
        return rawKey !== undefined;
    }

    private static createKey(userId: User["id"], storeId: Store["id"]): string {
        return `zs_${userId}_${storeId}`;
    }

    private static createStoreKey(storeId: Store["id"]): string {
        return `zsk_${storeId}`;
    }
}
