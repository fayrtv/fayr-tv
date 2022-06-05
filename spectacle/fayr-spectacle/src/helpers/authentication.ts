import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { supabase } from "~/supabase";
import { User } from "~/types/user";
import { supabaseServerClient } from "@supabase/supabase-auth-helpers/nextjs";

export const ssrGetUser = async (req: { cookies: NextApiRequestCookies }) => {
    const userInfo = await supabaseServerClient({ req });

    const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, address, user_email, newsletter, title")
        .eq("id", userInfo?.id)
        .single();

    const user: User = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        address: data.address,
        email: data.user_email,
        newsletter: data.newsletter,
        title: data.title,
    };

    return user;
};
