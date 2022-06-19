import ILocalEncryptionStorageHandler from "./localPersistence/ILocalEncryptionStorageHandler";
import IKeyExchanger from "./exchange/IKeyExchanger";
import { Customer, Store } from "~/models";
import { User } from "~/types/user";
import { SerializedAesEncryptionPackage } from "./encryptionTypes";
import { base64EncodeBuffer, base64DecodeToBuffer, ab2b64, b642ab } from "./encodingUtils";
import { DataStore } from "aws-amplify";

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
    isDeviceSecretSetForUser(userId: User["id"], storeId: Store["id"]): Promise<boolean>;
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
        await this._localEncryptionStorageHandler.setStorePrivateKey(privateKey!, storeId);

        return privateKey!;
    }

    /**
     * Check if secret is already set up for the account context
     */
    public async isDeviceSecretSetForUser(userId: string, storeId: string): Promise<boolean> {
        const customers = await DataStore.query(Customer, (s) =>
            s.id("eq", userId).customerOfStoreID("eq", storeId),
        );

        const customer = customers[0];

        return !!customer.encryptedSecret;
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

        const secret = await this.generateLocalSecret(userId, storeId);

        // This is the exported key we can now sign with the stores public key
        const exportedSecret = await subtle.exportKey("jwk", secret);

        const exportedKeyBuffer = this._encoder.encode(JSON.stringify(exportedSecret));

        // Get the public key of the store and encrypt it
        const storePublicKey = await this._keyExchanger.getStorePublicKey(storeId);

        const encryptedSecretBuffer: Uint8Array = await subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            storePublicKey,
            exportedKeyBuffer,
        );

        const encryptedKeyStringified = ab2b64(encryptedSecretBuffer);

        await this._keyExchanger.persistEncryptedSecret(encryptedKeyStringified, userId, storeId);
    }

    public async encrypt(
        data: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<SerializedAesEncryptionPackage> {
        const hasCustomerSecret = await this._localEncryptionStorageHandler.hasSecret(
            userId,
            storeId,
        );

        const subtle = window.crypto.subtle;

        if (!hasCustomerSecret) {
            // First, grab the customers secret
            const customers = await DataStore.query(Customer, (s) =>
                s.id("eq", userId).customerOfStoreID("eq", storeId),
            );

            const stringifiedEncryptedSecret = customers[0].encryptedSecret as string;
            const encryptedSecret = b642ab(stringifiedEncryptedSecret);

            // Now, grab the private key of the store
            const storePrivateKey = await this._localEncryptionStorageHandler.getStorePrivateKey(
                storeId,
            );

            // Decrypt the secret with the stores private key
            const decryptedSecretBuffer: BufferSource = await subtle.decrypt(
                {
                    name: "RSA-OAEP",
                },
                storePrivateKey!,
                encryptedSecret,
            );

            const decryptedSecretJson = JSON.parse(this._decoder.decode(decryptedSecretBuffer));

            // And import it to the indexeddb
            const decryptedSecret = await window.crypto.subtle.importKey(
                "jwk",
                decryptedSecretJson,
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"],
            );

            await this._localEncryptionStorageHandler.setSecret(decryptedSecret, userId, storeId);
        }

        const secret = await this._localEncryptionStorageHandler.getSecret(userId, storeId);

        const operationScopedIv = this.createRandomInitializationVector();

        const encodedData = this._encoder.encode(data);
        const encryptedData: ArrayBuffer = await subtle.encrypt(
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
