import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { withSSRContext } from "aws-amplify";
import { User } from "~/models/user";

export const getUser = async (req: { cookies: NextApiRequestCookies }) => {
    const SSR = withSSRContext({ req });
    const userInfo = await SSR.Auth.currentUserInfo();

    const attributes = userInfo?.attributes;

    if (!attributes) {
        return null;
    }

    const user: User = {
        // Builtin
        email: attributes.email,
        emailVerified: attributes.email_verified,
        lastName: attributes.family_name ?? null,
        // Custom
        address: attributes["custom:address"] ?? null,
        title: attributes["custom:title"] ?? null,
        firstName: attributes["custom:first_name"] ?? null,
        newsletter: attributes["custom:newsletter"] ?? null,
    };

    return user;
};

