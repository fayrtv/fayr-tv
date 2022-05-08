import { createContext, useContext } from "react";

const StoreInfoContext = createContext({
    name: "",
    city: "",
    owner: "",
    fullAddress: "",
});

export const useStoreInfo = () => {
    return useContext(StoreInfoContext);
};

const StoreInfoProvider = StoreInfoContext.Provider;
export default StoreInfoProvider;
