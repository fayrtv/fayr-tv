import { DataStore } from "aws-amplify";
import { Store } from "~/models";
import IKeyExchanger from "./IKeyExchanger";

export default class AmplifyStoreKeyExchanger implements IKeyExchanger {
    public async storeStorePublicKey(publicKey: CryptoKey, storeId: string): Promise<void> {
        const subtle = window.crypto.subtle;

        const exportedPublicKey = await subtle.exportKey("jwk", publicKey);

        const stores = await DataStore.query(Store, (s) => s.id("eq", storeId));

        const store = stores[0];

        await DataStore.save(
            Store.copyOf(store, (updated) => {
                updated.publicKey = JSON.stringify(exportedPublicKey);
            }),
        );
    }

    public async getStorePublicKey(storeId: string): Promise<CryptoKey> {
        const stores = await DataStore.query(Store, (s) => s.id("eq", storeId));
        const store = stores[0];

        const rawPublicKey = store.publicKey!;

        const parsedPublicKey = JSON.parse(rawPublicKey);

        return await window.crypto.subtle.importKey("jwk", parsedPublicKey, "RSA-OAEP", true, [
            "encrypt",
            "decrypt",
        ]);
    }

    storeEncryptedSecret(encryptedSecret: string, userId: string, storeId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
