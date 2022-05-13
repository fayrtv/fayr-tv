import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { withSSRContext } from "aws-amplify";
import { User } from "~/types/user";

export const createUserFromAttributes = (userAttributes: any) => {
    const user: User = {
        // Builtin
        email: userAttributes.email,
        emailVerified: userAttributes.email_verified,
        lastName: userAttributes.family_name ?? null,
        // Custom
        address: userAttributes["custom:address"] ?? null,
        title: userAttributes["custom:title"] ?? null,
        firstName: userAttributes["custom:first_name"] ?? null,
        newsletter: userAttributes["custom:newsletter"] ?? null,
    };

    return user;
};

export const getUser = async (req: { cookies: NextApiRequestCookies }) => {
    const SSR = withSSRContext({ req });
    const userInfo = await SSR.Auth.currentUserInfo();
    const attributes = userInfo?.attributes;

    if (!attributes) {
        return null;
    }

    return createUserFromAttributes(attributes);
};
