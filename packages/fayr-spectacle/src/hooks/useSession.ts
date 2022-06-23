import { Auth, DataStore } from "aws-amplify";
import { useQuery } from "react-query";
import { convertAwsModelToUser } from "~/helpers/awsModelParser";
import { Customer } from "~/models";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { useCallback } from "react";

export const useSession = () => {
    const { id: storeID, adminUserIDs } = useStoreInfo();

    const { isLoading, data } = useQuery("get-user", async () => {
        const userInfo = await Auth.currentUserInfo();
        const user = userInfo?.attributes ? convertAwsModelToUser(userInfo) : undefined;

        if (!user) {
            return {
                user: undefined,
                customer: undefined,
            };
        }

        const customerResult = await DataStore.query(Customer, (c) =>
            c.userID("eq", user.id).customerOfStoreID("eq", storeID),
        );

        if (customerResult.length === 0) {
            return { user: user, customer: undefined };
        }

        return { user: user, customer: customerResult[0] };
    });

    const user = data?.user;
    const customer = data?.customer;

    const getOrCreateCustomer = useCallback(async () => {
        if (!user) {
            throw Error("Cannot create customer without logged-in user");
        }
        if (customer) {
            return customer;
        }
        const newCustomer = new Customer({
            userID: user?.id,
            customerOfStoreID: storeID,
        });
        await DataStore.save(newCustomer);
        return newCustomer;
    }, [customer, storeID, user]);

    const isAdmin = user?.id && adminUserIDs.includes(user.id);

    return {
        isLoading,
        user,
        customer,
        isAuthenticated: !!user,
        isAdmin,
        getOrCreateCustomer,
    };
};