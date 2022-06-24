import { SaveSecretParameters } from "~/pages/api/encryption/savesecret";
import { SavePublicKeyParameters } from "~/pages/api/encryption/savestorepublickey";
import IKeyExchanger from "./IKeyExchanger";

export default class ClientSideAmplifyStoreKeyExchangerDecorator implements IKeyExchanger {
    private _amplifyKeyExchanger: IKeyExchanger;

    public constructor(amplifyKeyExchanger: IKeyExchanger) {
        this._amplifyKeyExchanger = amplifyKeyExchanger;
    }

    public setStorePublicKey = async (publicKey: CryptoKey, storeId: string): Promise<void> => {
        const subtle = window.crypto.subtle;
        const exportedPublicKey = await subtle.exportKey("jwk", publicKey!);
        const stringifiedPublicKey = JSON.stringify(exportedPublicKey);

        await fetch("/api/encryption/savestorepublickey", {
            body: JSON.stringify({
                stringifiedPublicKey,
                storeId,
            } as SavePublicKeyParameters),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    public getStorePublicKey(storeId: string): Promise<CryptoKey> {
        return this._amplifyKeyExchanger.getStorePublicKey(storeId);
    }

    public persistEncryptedSecret = async (
        encryptedSecret: string,
        secretHash: string,
        _: string,
        storeId: string,
    ): Promise<void> => {
        await fetch("/api/encryption/savesecret", {
            body: JSON.stringify({
                encryptedSecret,
                encryptionHash: secretHash,
                storeId: storeId,
            } as SaveSecretParameters),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    };
}
