import { User } from "~/types/user";

type AwsUserResponse = {
    username: string;
    attributes: { [key: string]: any };
};

export const convertAwsModelToUser = (response: AwsUserResponse) => {
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
        newsletteremail: userAttributes["custom:newsletteremail"] ?? userAttributes.email,
        firstName: userAttributes["custom:first_name"] ?? null,
        newsletter:
            userAttributes["custom:newsletter"] !== undefined
                ? !!userAttributes["custom:newsletter"]
                : false,
        city: userAttributes["custom:city"] ?? null,
        phone: userAttributes["custom:phone"] ?? null,
    };

    return user;
};
