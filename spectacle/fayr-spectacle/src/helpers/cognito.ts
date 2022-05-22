import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    ListUsersCommandOutput,
    UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { DataStore, withSSRContext } from "aws-amplify";
import { IncomingMessage } from "http";
import { getCurrentStore } from "./storeLocator";
import { Customer as CustomerEntity } from "~/models";
import { User as UserDto } from "~/types/user";

export const convertCognitoUserToUserDto = (cognitoUser: UserType): UserDto => {
    if (!cognitoUser.Username) {
        // TODO: Temporary sanity check to see if this is always available.
        //       Can be removed latest April.
        throw Error("Unable to find user ID in amplify response.");
    }

    const userAttributes = cognitoUser.Attributes!;

    const userDto = {} as UserDto & {
        [name: string]: string | null;
    };

    for (const { Name, Value } of userAttributes) {
        if (Name?.startsWith("custom")) {
            switch (Name) {
                case "custom:first_name":
                    userDto.firstName = Value! ?? null;
                case "custom:family_name":
                    userDto.lastName = Value! ?? null;
                default:
                    userDto[Name.substring(Name.indexOf(":") + 1)] = Value! ?? null;
            }
        } else {
            userDto[Name!] = Value!;
        }
    }
    return userDto;
};

export const getUsersForCurrentStore = async (req: IncomingMessage, userPoolId: string) => {
    const SSR = withSSRContext({ req });
    const store = SSR.DataStore as typeof DataStore;

    const zeissStore = await getCurrentStore(req);
    const storeId = zeissStore.id;

    const listUsersCommand = new ListUsersCommand({
        UserPoolId: userPoolId,
    });

    const cognitoClient = await getCognitoClient(req);

    const [storeCustomers, listUsersResponse] = await Promise.all([
        store.query(CustomerEntity, (x) => x.storeID("eq", storeId)),
        cognitoClient.send(listUsersCommand),
    ]);

    const storeCustomerIds = storeCustomers.map((x) => x.userID);

    const eligibleUsers = listUsersResponse.Users?.filter((x) =>
        storeCustomerIds.some((y) => y === x.Username),
    );

    return eligibleUsers?.map(convertCognitoUserToUserDto);
};

export const getCognitoClient = async (
    req: IncomingMessage,
): Promise<CognitoIdentityProviderClient> => {
    const SSR = withSSRContext({ req });

    const currentCredentials = await SSR.Auth.currentCredentials();
    const essentialAwsCredentials = await SSR.Auth.essentialCredentials(currentCredentials);

    return new CognitoIdentityProviderClient({
        region: "eu-central-1",
        credentials: { ...essentialAwsCredentials },
    });
};
