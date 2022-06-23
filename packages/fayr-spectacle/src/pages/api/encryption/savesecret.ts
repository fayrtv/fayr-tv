import {
    BadRequestException,
    Body,
    createHandler,
    ForbiddenException,
    Post,
    Req,
} from "@storyofams/next-api-decorators";
import { ssrGetUser } from "~/helpers/authentication";
import { DataStore } from "aws-amplify";
import { NextApiRequest } from "next";
import AmplifyStoreKeyExchanger from "~/utils/encryption/exchange/AmplifyStoreKeyExchanger";
import IKeyExchanger from "~/utils/encryption/exchange/IKeyExchanger";
import { Customer } from "~/models";

export type SaveSecretParameters = {
    encryptedSecret: string;
    encryptionHash: string;
    storeId: string;
};

const storeExchanger: IKeyExchanger = new AmplifyStoreKeyExchanger();

class SaveSecret {
    @Post()
    public async post(
        @Body() { encryptedSecret, encryptionHash, storeId }: SaveSecretParameters,
        @Req() req: NextApiRequest,
    ) {
        const user = await ssrGetUser(req);
        if (!user) {
            throw new ForbiddenException(
                "Couldn't determine user and therefore whether the user is allowed to access this resource",
            );
        }

        const userId = user.id;

        // Ensure user is assigned to this store
        const customers = await DataStore.query(Customer, (s) =>
            s.userID("eq", userId).customerOfStoreID("eq", storeId),
        );

        if (customers.length === 0) {
            throw new BadRequestException("This customer is not part of this store");
        }

        await storeExchanger.persistEncryptedSecret(
            encryptedSecret,
            encryptionHash,
            user.id,
            customers[0].customerOfStoreID!,
        );

        return;
    }
}

export default createHandler(SaveSecret);
