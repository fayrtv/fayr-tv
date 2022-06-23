import { Store } from "~/models";
import { User } from "~/types/user";

export default interface IKeyExchanger {
    persistEncryptedSecret(
        encryptedSecret: string,
        secretHash: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<void>;

    setStorePublicKey(publicKey: CryptoKey, storeId: Store["id"]): Promise<void>;
    getStorePublicKey(storeId: Store["id"]): Promise<CryptoKey>;
}