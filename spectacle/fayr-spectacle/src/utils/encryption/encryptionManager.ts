import ILocalEncryptionStorageHandler from "./localPersistence/ILocalEncryptionStorageHandler";
import IKeyExchanger from "./exchange/IKeyExchanger";
import { DataStore } from "aws-amplify";
import { Store } from "~/models";

export default interface IEncryptionManager {
    encrypt(data: string): Promise<string>;
    setupDeviceSecretIfNotExists(storeId: string): Promise<void>;
    createStoreKeyPair(storeId: string): Promise<CryptoKey>;
}

export class EncryptionManager implements IEncryptionManager {
    private _localEncryptionStorageHandler: ILocalEncryptionStorageHandler;

    private _keyExchanger: IKeyExchanger;

    public constructor(
        localEncryptionStorageHandler: ILocalEncryptionStorageHandler,
        keyExchanger: IKeyExchanger,
    ) {
        this._localEncryptionStorageHandler = localEncryptionStorageHandler;
        this._keyExchanger = keyExchanger;
    }

    /**
     * Sets up asymmetric encryption for a store.
     * In addition, this takes over the whole process of exchanging the key.
     *
     * @param storeId Id of the store
     *
     * @returns Private key to be displayed or stored somewhere for the user
     */
    public async createStoreKeyPair(storeId: string): Promise<CryptoKey> {
        const subtle = window.crypto.subtle;

        const { publicKey, privateKey } = await subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"],
        );

        await this._keyExchanger.storeStorePublicKey(publicKey!, storeId);

        return privateKey!;
    }

    /**
     * Sets up local symmetric encryption key if it does not yet exists.
     * In addition, this takes over the whole process of exchanging the key
     */
    public async setupDeviceSecretIfNotExists(storeId: string): Promise<void> {
        // TODO: Add failure handling and transaction rollback logic
        if (await this._localEncryptionStorageHandler.hasSecret(storeId)) {
            return;
        }

        const subtle = window.crypto.subtle;

        const key = await this.generateLocalSecret(storeId);

        // This is the exported key we can now sign with the stores public key
        const exportedKey = (await subtle.exportKey("jwk", key)).k;

        const storePublicKey = await this._keyExchanger.getStorePublicKey(storeId);
    }

    public encrypt(data: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    private generateLocalSecret = async (storeId: string): Promise<CryptoKey> => {
        const subtle = window.crypto.subtle;
        const aesSymmetricKey = await subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        );

        await this._localEncryptionStorageHandler.storeSecret(aesSymmetricKey, storeId);

        return aesSymmetricKey;
    };
}
