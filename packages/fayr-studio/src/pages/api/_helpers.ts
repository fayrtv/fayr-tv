import { NextApiRequest, NextApiResponse } from "next";
import { DefaultSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function tryGetUser(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<[true, DefaultSession["user"]] | [false, undefined]> {
    const session = await getSession({ req });

    const user = session?.user;

    if (!user?.email) {
        res.status(403).json({ ok: false, message: "Please login first" });
        return [false, undefined];
    }

    return [true, user];
}
