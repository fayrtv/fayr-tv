import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { withSSRContext } from "aws-amplify";
import { User } from "~/types/user";

type AmplifyUserResponse = {
    username: string;
    attributes: { [key: string]: any };
};

export const convertAmplifyAuthUser = (response: AmplifyUserResponse) => {
    const userAttributes = response.attributes;

    if (!response.username) {
        // TODO: Temporary sanity check to see if this is always available.
        //       Can be removed latest April.
        throw Error("Unable to find user ID in amplify response.");
    }

    const user: User = {
        id: response.username,
        // Builtin
        email: userAttributes.email,
        emailVerified: userAttributes.email_verified,
        lastName: userAttributes.family_name ?? null,
        // Custom
        address: userAttributes["custom:address"] ?? null,
        title: userAttributes["custom:title"] ?? null,
        firstName: userAttributes["custom:first_name"] ?? null,
        newsletter: userAttributes["custom:newsletter"] ?? null,
        city: userAttributes["custom:city"] ?? null,
        phone: userAttributes["custom:phone"] ?? null,
    };

    return user;
};

export const getUser = async (req: { cookies: NextApiRequestCookies }) => {
    const SSR = withSSRContext({ req });
    const userInfo = await SSR.Auth.currentUserInfo();

    if (!userInfo?.attributes) {
        return null;
    }

    return convertAmplifyAuthUser(userInfo);
};
