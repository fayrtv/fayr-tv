import { PlatformConfig } from "@fayr/api-contracts";
import {
    Body,
    ConflictException,
    createHandler,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
    ValidationPipe,
} from "@storyofams/next-api-decorators";
import { convertCognitoUserToUserDto, getCognitoClient, getUsersForStore } from "~/helpers/cognito";
import { NextApiRequest } from "next";
import { ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Customer, Customer as CustomerEntity } from "~/models";
import { convertAwsModelToUser } from "~/helpers/awsModelParser";
import { getUser } from "~/helpers/authentication";
import { getCurrentStore } from "~/helpers/storeLocator";
import { DataStore, withSSRContext } from "aws-amplify";
import { SerializedModel, serializeModel } from "~/models/amplify-models";

export type LinkExistingCustomerRequest = { userEmail: string };
export type LinkExistingCustomerResponse = { customer: SerializedModel<Customer> };

class LinkExistingCustomer {
    @Post()
    public async post(
        @Body(ValidationPipe) body: LinkExistingCustomerRequest,
        @Req() req: NextApiRequest,
    ): Promise<LinkExistingCustomerResponse> {
        const SSR = withSSRContext({ req });
        const dataStore = SSR.DataStore as typeof DataStore;

        const admin = await getUser(req);
        const store = await getCurrentStore(req);
        if (!admin?.id || !store?.adminUserIDs.includes(admin.id)) {
            throw new UnauthorizedException(
                "You must be an admin of this store to use this endpoint.",
            );
        }
        const cognitoClient = await getCognitoClient(req);

        const userEmail = body.userEmail.toLowerCase().trim();

        // TODO: GetUserCommand would be more efficient if we figure out how to use it...
        const listUsersCommand = new ListUsersCommand({
            UserPoolId: "eu-central-1_yf1nAYpsJ",
        });

        const storeUsers = await cognitoClient.send(listUsersCommand);

        const foundUser = storeUsers.Users?.map((u) => convertCognitoUserToUserDto(u)).find(
            (x) => x.email.toLowerCase() === userEmail.toLowerCase(),
        );

        if (!foundUser) {
            throw new NotFoundException(`Unable to find user with E-Mail '${userEmail}'`);
        }

        const existingCustomer = await dataStore.query(Customer, (c) =>
            c.userID("eq", foundUser.id).customerOfStoreId("eq", store.id),
        );

        if (existingCustomer.length > 0) {
            throw new ConflictException(
                `A customer of store ${store.id} with email '${userEmail}' already exists.`,
            );
        }

        const customer = new Customer({
            userID: foundUser.id,
            customerOfStoreId: store.id,
        });

        await SSR.DataStore.save(customer);

        return { customer: serializeModel(customer) };
    }
}

export default createHandler(LinkExistingCustomer);
