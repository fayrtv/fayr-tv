import { Auth, DataStore } from "aws-amplify";
import { useQuery } from "react-query";
import { Customer } from "~/models";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "~/supabase";
import { User } from "~/types/user";
import { useUser } from "@supabase/supabase-auth-helpers/react";

export const useSession = () => {
    const [isLoading, setLoading] = useState(true);
    const { id: storeID, adminUserIDs } = useStoreInfo();

    // const { isLoading, data } = useQuery("get-user", async () => {
    //     const userInfo = await supabase.auth.user();
    //
    //     const { data, error } = await supabase
    //         .from("profiles")
    //         .select("id, first_name, last_name, address, user_email, newsletter, title")
    //         .eq("id", userInfo?.id)
    //         .single();
    //
    //     if (error) {
    //         return {
    //             user: undefined,
    //             customer: undefined,
    //         };
    //     }
    //
    //     const user: User = {
    //         id: data.id,
    //         firstName: data.first_name,
    //         lastName: data.last_name,
    //         address: data.address,
    //         email: data.user_email,
    //         newsletter: data.newsletter,
    //         title: data.title,
    //     };
    //
    //     // const customerResult = await supabase.query(Customer, (c) =>
    //     //     c.userID("eq", user.id).customerOfStoreID("eq", storeID),
    //     // );
    //     //
    //     // if (customerResult.length === 0) {
    //     //     return { user: user, customer: undefined };
    //     // }
    //
    //     // return { user: user, customer: customerResult[0] };
    //
    //     return { user: user, customer: undefined };
    // });

    const { user: userData } = useUser();

    const [profile, setProfile] = useState<Record<string, any> | undefined>(undefined);

    useEffect(() => {
        async function loadData() {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, first_name, last_name, address, user_email, newsletter, title")
                .eq("id", userData?.id)
                .single();
            setProfile(data);
        }
        // Only run query once user is logged in.
        if (userData) loadData();
    }, [userData]);

    if (!userData || !profile) {
        return {
            isLoading: true,
            user: undefined,
            customer: undefined,
            isAuthenticated: false,
            isAdmin: false,
            getOrCreateCustomer: undefined,
        };
    }

    const user: User = {
        // TODO
        city: "",
        emailVerified: false,
        newsletteremail: "",
        phone: "",
        // end TODO
        id: userData.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        address: profile.address,
        email: profile.user_email,
        newsletter: profile.newsletter,
        title: profile.title,
    };

    setLoading(false);

    // const getOrCreateCustomer = useCallback(async () => {
    //     if (!user) {
    //         throw Error("Cannot create customer without logged-in user");
    //     }
    //     if (customer) {
    //         return customer;
    //     }
    //     const newCustomer = new Customer({
    //         userID: user?.id,
    //         customerOfStoreID: storeID,
    //     });
    //     await DataStore.save(newCustomer);
    //     return newCustomer;
    // }, [customer, storeID, user]);

    const isAdmin = user?.id && adminUserIDs.includes(user.id);

    return {
        isLoading,
        user,
        customer: undefined,
        isAuthenticated: !!user,
        isAdmin,
        getOrCreateCustomer: undefined,
    };
};
