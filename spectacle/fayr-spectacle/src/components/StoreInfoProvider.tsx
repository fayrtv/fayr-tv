import { createContext, useContext } from "react";
import { SerializedModel } from "~/models/amplify-models";
import { Store } from "~/models";

const StoreInfoContext = createContext<SerializedModel<Store>>({
    id: "",
    name: "",
    city: "",
    owner: "",
    fullAddress: "",
    phoneNumber: undefined,
});

export const useStoreInfo = () => {
    return useContext(StoreInfoContext);
};

const StoreInfoProvider = StoreInfoContext.Provider;
export default StoreInfoProvider;
