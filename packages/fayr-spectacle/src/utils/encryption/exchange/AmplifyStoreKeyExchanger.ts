import { DataStore } from "aws-amplify";
import { Customer, Store } from "~/models";
import { User } from "~/types/user";
import IKeyExchanger from "./IKeyExchanger";

export default class AmplifyStoreKeyExchanger implements IKeyExchanger {
    public async setStorePublicKey(publicKey: CryptoKey, storeId: string): Promise<void> {
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

        return await window.crypto.subtle.importKey(
            "jwk",
            parsedPublicKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            // Operations permitted only include encryption here since we work with the public key
            ["encrypt"],
        );
    }

    public async persistEncryptedSecret(
        encryptedSecret: string,
        secretHash: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<void> {
        // TODO: This might have to happen on the backend, otherwise any user can overwrite secrets of someone else
        const customers = await DataStore.query(Customer, (s) =>
            s.userID("eq", userId).customerOfStoreID("eq", storeId),
        );

        const customer = customers[0];

        await DataStore.save(
            Customer.copyOf(customer, (updated) => {
                updated.encryptedSecret = encryptedSecret;
                updated.encryptionHash = secretHash;
            }),
        );
    }
}
