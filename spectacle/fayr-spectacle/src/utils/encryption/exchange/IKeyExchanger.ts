import { Store } from "~/models";
import { User } from "~/types/user";

export default interface IKeyExchanger {
    // TODO: Name is misleading because "store" is ambiguous
    storeEncryptedSecret(
        encryptedSecret: string,
        userId: User["id"],
        storeId: Store["id"],
    ): Promise<void>;

    setStorePublicKey(publicKey: CryptoKey, storeId: Store["id"]): Promise<void>;
    getStorePublicKey(storeId: Store["id"]): Promise<CryptoKey>;
}
