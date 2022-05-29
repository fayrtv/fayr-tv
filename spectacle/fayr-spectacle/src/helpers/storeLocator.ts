import { DataStore, withSSRContext } from "aws-amplify";
import { IncomingMessage } from "http";
import { Store } from "~/models";

export const getCurrentStore = async (req: IncomingMessage | undefined): Promise<Store> => {
    const SSR = withSSRContext({ req });
    const dataStore = SSR.DataStore as typeof DataStore;

    // TODO: Replace with store from the current domain (Depending on the final scheme we use)
    try {
        const result = await dataStore.query(Store, (s) => s.city("eq", "Osnabrück"));
        return result[0];
    } catch (err) {
        console.error({ message: "Unable to load default store. Check the Amplify Data model." });
        throw err;
    }
};
