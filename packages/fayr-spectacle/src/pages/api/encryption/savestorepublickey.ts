import {
    Body,
    createHandler,
    ForbiddenException,
    Post,
    Req,
} from "@storyofams/next-api-decorators";
import { ssrGetUser } from "~/helpers/authentication";
import { DataStore } from "aws-amplify";
import { NextApiRequest } from "next";
import { Store } from "~/models";

export type SavePublicKeyParameters = {
    stringifiedPublicKey: string;
    storeId: string;
};

class SaveStorePublicKey {
    @Post()
    public async post(
        @Body() { stringifiedPublicKey, storeId }: SavePublicKeyParameters,
        @Req() req: NextApiRequest,
    ) {
        debugger;
        const user = await ssrGetUser(req);
        if (!user) {
            throw new ForbiddenException(
                "Couldn't determine user and therefore whether the user is allowed to access this resource",
            );
        }

        // Assert that this user is an admin of the store
        const stores = await DataStore.query(Store, (s) => s.id("eq", storeId));
        const store = stores[0];

        if (store.adminUserIDs.findIndex((x) => x === user.id) === -1) {
            throw new ForbiddenException("User is no admin of the store");
        }

        await DataStore.save(
            Store.copyOf(store, (updated) => {
                updated.publicKey = stringifiedPublicKey;
            }),
        );

        return;
    }
}

export default createHandler(SaveStorePublicKey);
