import ILocalEncryptionStorageHandler from "./localPersistence/ILocalEncryptionStorageHandler";
import IKeyExchanger from "./exchange/IKeyExchanger";
import { Store } from "~/models";
import { User } from "~/types/user";

export default interface IEncryptionManager {
    encrypt(data: string, userId: User["id"], storeId: Store["id"]): Promise<string>;
    decrypt(encryptedData: string, userId: User["id"], storeId: Store["id"]): Promise<string>;
    setupDeviceSecretIfNotExists(userId: User["id"], storeId: Store["id"]): Promise<void>;
    createStoreKeyPair(storeId: Store["id"]): Promise<CryptoKey>;
}

export class EncryptionManager implements IEncryptionManager {
    private readonly _localEncryptionStorageHandler: ILocalEncryptionStorageHandler;
    private readonly _keyExchanger: IKeyExchanger;
    private readonly _encoder: TextEncoder;
    private readonly _decoder: TextDecoder;
    private readonly _iv: Uint8Array;

    public constructor(
        localEncryptionStorageHandler: ILocalEncryptionStorageHandler,
        keyExchanger: IKeyExchanger,
    ) {
        this._localEncryptionStorageHandler = localEncryptionStorageHandler;
        this._keyExchanger = keyExchanger;

        this._encoder = new TextEncoder();
        this._decoder = new TextDecoder();

        // TODO: Is this secure? Needs to be the same for encode & decode, but not sure how impactful it is not to regenerate?
        this._iv = new Uint8Array([
            47, 207, 210, 108, 112, 13, 31, 44, 90, 137, 252, 209, 159, 227, 206, 124,
        ]);
    }

    /**
     * Sets up asymmetric encryption for a store.
     * In addition, this takes over the whole process of exchanging the key.
     *
     * @param storeId Id of the store
     *
     * @returns Private key to be displayed or stored somewhere for the user
     */
    public async createStoreKeyPair(storeId: Store["id"]): Promise<CryptoKey> {
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

        await this._keyExchanger.setStorePublicKey(publicKey!, storeId);

        return privateKey!;
    }

    /**
     * Sets up local symmetric encryption key if it does not yet exist.
     * In addition, this takes over the whole process of exchanging the key
     */
    public async setupDeviceSecretIfNotExists(
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<void> {
        // TODO: Add failure handling and transaction rollback logic
        if (await this._localEncryptionStorageHandler.hasSecret(userId, storeId)) {
            return;
        }

        const subtle = window.crypto.subtle;

        const key = await this.generateLocalSecret(userId, storeId);

        // This is the exported key we can now sign with the stores public key
        const exportedKey = await subtle.exportKey("jwk", key);
        const exportedKeyStringified = this._encoder.encode(JSON.stringify(exportedKey));

        // Get the public key of the store and encrypt it
        const storePublicKey = await this._keyExchanger.getStorePublicKey(storeId);
        const encryptedKey: string = await subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            storePublicKey,
            exportedKeyStringified,
        );

        await this._keyExchanger.storeEncryptedSecret(encryptedKey, userId, storeId);
    }

    public async encrypt(data: string, userId: User["id"], storeId: Store["id"]): Promise<string> {
        const secret = await this._localEncryptionStorageHandler.getSecret(userId, storeId);

        const encodedData = this._encoder.encode(data);

        const encryptedData: BufferSource = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: this._iv,
                length: 64,
            },
            secret!,
            encodedData,
        );

        const encryptedDataStringified = this._decoder.decode(encryptedData);

        return encryptedDataStringified;
    }

    public async decrypt(
        encryptedData: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<string> {
        const secret = await this._localEncryptionStorageHandler.getSecret(userId, storeId);

        const encodedEncryptedData = this._encoder.encode(encryptedData);

        const decryptedData: BufferSource = await window.crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                iv: this._iv,
                length: 64,
            },
            secret!,
            encodedEncryptedData,
        );

        const decodedData = this._decoder.decode(decryptedData);

        return decodedData;
    }

    private generateLocalSecret = async (
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<CryptoKey> => {
        const subtle = window.crypto.subtle;
        const aesSymmetricKey = await subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        );

        await this._localEncryptionStorageHandler.storeSecret(aesSymmetricKey, userId, storeId);

        return aesSymmetricKey;
    };
}
