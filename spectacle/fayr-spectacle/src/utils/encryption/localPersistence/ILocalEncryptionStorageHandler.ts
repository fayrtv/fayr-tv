import { Store } from "~/models";
import { User } from "~/types/user";

type StoreId = Store["id"];

// Note: All function additional have the userId attached so a secret can also uniquely be identified on the optician side.
// For example: Optician performed the key exchange with customer X. Since he did this with customer Y as well, we can't just
// grab any key for the current store, but rather need to get the correct key for customer X as well. On customer side this
// is not necessary, but it also won't hurt to do this in the common interface
export default interface ILocalEncryptionStorageHandler {
    storeSecret(rawSecret: CryptoKey, userId: User["id"], storeId: StoreId): Promise<void>;
    getSecret(userId: User["id"], storeId: StoreId): Promise<CryptoKey | undefined>;
    hasSecret(userId: User["id"], storeId: StoreId): Promise<boolean>;
}
