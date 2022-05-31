import { createHandler, Delete, Query, Req } from "@storyofams/next-api-decorators";
import { NextApiRequest } from "next";
import { Customer } from "~/models";
import { DataStore, withSSRContext } from "aws-amplify";
import { AdminGuard } from "~/helpers/adminGuard";

class RemoveCustomer {
    @Delete()
    @AdminGuard()
    public async delete(
        @Req() req: NextApiRequest,
        @Query("id") customerId: string,
    ): Promise<void> {
        const SSR = withSSRContext({ req });
        const dataStore = SSR.DataStore as typeof DataStore;

        await dataStore.delete(Customer, customerId);
    }
}

export default createHandler(RemoveCustomer);
