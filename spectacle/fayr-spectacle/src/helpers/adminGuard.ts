import {
    createMiddlewareDecorator,
    NextFunction,
    UnauthorizedException,
} from "@storyofams/next-api-decorators";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentStore } from "~/helpers/storeLocator";
import { Store } from "~/models";
import { User } from "~/types/user";
import { getUser } from "~/helpers/authentication";

export function ensureIsAdminOfStore(store?: Store, user?: User | null) {
    if (!user?.id || !store?.adminUserIDs.includes(user.id)) {
        throw new UnauthorizedException("You must be an admin of this store to use this endpoint.");
    }
}

export const AdminGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const [admin, store] = await Promise.all([getUser(req), getCurrentStore(req)]);
        ensureIsAdminOfStore(store, admin);
        next();
    },
);
