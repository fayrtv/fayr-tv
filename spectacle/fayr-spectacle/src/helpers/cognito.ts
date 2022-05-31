import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    ListUsersCommandOutput,
    UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { DataStore, withSSRContext } from "aws-amplify";
import { IncomingMessage } from "http";
import { getCurrentStore } from "./storeLocator";
import { Customer as CustomerEntity, Store } from "~/models";
import { Customer, User as UserDto } from "~/types/user";
import { convertAwsModelToUser } from "./awsModelParser";

export const convertCognitoUserToUserDto = (cognitoUser: UserType): UserDto => {
    if (!cognitoUser.Username) {
        // TODO: Temporary sanity check to see if this is always available.
        //       Can be removed latest April.
        throw Error("Unable to find user ID in amplify response.");
    }

    const userAttributes = cognitoUser.Attributes!;

    type TransformedAttributes = {
        [key: string]: any;
    };

    const attributes: TransformedAttributes = {};
    userAttributes.forEach(({ Name, Value }) => (attributes[Name!] = Value));

    return convertAwsModelToUser({
        username: cognitoUser.Username,
        attributes: attributes,
    });
};

export const getStoreCustomers = async (
    req: IncomingMessage,
    store: Store,
    userPoolId: string,
): Promise<Customer[]> => {
    const SSR = withSSRContext({ req });
    const dataStore = SSR.DataStore as typeof DataStore;

    const storeId = store.id;

    const listUsersCommand = new ListUsersCommand({
        UserPoolId: userPoolId,
    });

    const cognitoClient = await getCognitoClient(req);

    const [storeCustomers, listUsersResponse] = await Promise.all([
        dataStore.query(CustomerEntity, (x) => x.customerOfStoreID("eq", storeId)),
        cognitoClient.send(listUsersCommand),
    ]);

    const storeCustomerIDs = storeCustomers.map((x) => ({ userID: x.userID!, customerID: x.id }));

    if (!listUsersResponse.Users) {
        throw Error("Could not find any users.");
    }

    const result = [];

    for (const { customerID, userID } of storeCustomerIDs) {
        const correspondingUser = listUsersResponse.Users.find((x) => x.Username === userID);
        if (!correspondingUser) {
            console.warn(`Unable to find user for customer ID ${customerID}`);
            continue;
        }

        const customer: Customer = {
            ...convertCognitoUserToUserDto(correspondingUser),
            customerID,
        };
        result.push(customer);
    }

    return result;
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
