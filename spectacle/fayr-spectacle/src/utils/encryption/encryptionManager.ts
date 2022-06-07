import ILocalEncryptionStorageHandler from "./localPersistence/ILocalEncryptionStorageHandler";
import IKeyExchanger from "./exchange/IKeyExchanger";
import { Store } from "~/models";
import { User } from "~/types/user";
import { SerializedAesEncryptionPackage } from "./encryptionTypes";
import { base64EncodeBuffer, base64DecodeToBuffer } from "./encodingUtils";

export interface IEncryptionManager {
    encrypt(
        data: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<SerializedAesEncryptionPackage>;
    decrypt(
        encryptedData: SerializedAesEncryptionPackage,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<string>;
    setupDeviceSecretIfNotExists(userId: User["id"], storeId: Store["id"]): Promise<void>;
    createStoreKeyPair(storeId: Store["id"]): Promise<CryptoKey>;
}

// Recommended IV length is 96 https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams#properties
const defaultInitializationVectorLength = 96;

export class EncryptionManager implements IEncryptionManager {
    private readonly _localEncryptionStorageHandler: ILocalEncryptionStorageHandler;
    private readonly _keyExchanger: IKeyExchanger;
    private readonly _encoder: TextEncoder;
    private readonly _decoder: TextDecoder;

    public constructor(
        localEncryptionStorageHandler: ILocalEncryptionStorageHandler,
        keyExchanger: IKeyExchanger,
    ) {
        this._localEncryptionStorageHandler = localEncryptionStorageHandler;
        this._keyExchanger = keyExchanger;

        this._encoder = new TextEncoder();
        this._decoder = new TextDecoder();
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

        const encryptedKey: BufferSource = await subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            storePublicKey,
            exportedKeyStringified,
        );

        const encryptedKeyStringified = this._decoder.decode(encryptedKey);

        await this._keyExchanger.persistEncryptedSecret(encryptedKeyStringified, userId, storeId);
    }

    public async encrypt(
        data: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<SerializedAesEncryptionPackage> {
        // TODO: Get this secret from DB on demand
        const secret = await this._localEncryptionStorageHandler.getSecret(userId, storeId);

        const operationScopedIv = this.createRandomInitializationVector();

        const encodedData = this._encoder.encode(data);
        const encryptedData: ArrayBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: operationScopedIv,
                length: 64,
            },
            secret!,
            encodedData,
        );

        const [base64EncodedResult, encodedInitializationVector] = [
            base64EncodeBuffer(new Uint8Array(encryptedData)),
            base64EncodeBuffer(operationScopedIv),
        ];

        return {
            encryptedPayload: base64EncodedResult,
            encodedInitializationVector,
        };
    }

    public async decrypt(
        encryptedData: SerializedAesEncryptionPackage,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<string> {
        const secret = await this._localEncryptionStorageHandler.getSecret(userId, storeId);

        const [encryptedDataBuffer, initializationVectorBuffer] = [
            base64DecodeToBuffer(encryptedData.encryptedPayload),
            base64DecodeToBuffer(encryptedData.encodedInitializationVector),
        ];

        const decryptedData: ArrayBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: initializationVectorBuffer,
                length: 64,
            },
            secret!,
            encryptedDataBuffer,
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

        await this._localEncryptionStorageHandler.setSecret(aesSymmetricKey, userId, storeId);

        return aesSymmetricKey;
    };

    private createRandomInitializationVector = (
        length: number = defaultInitializationVectorLength,
    ) => {
        const buffer = new Uint8Array(length);
        return window.crypto.getRandomValues(buffer);
    };
}
