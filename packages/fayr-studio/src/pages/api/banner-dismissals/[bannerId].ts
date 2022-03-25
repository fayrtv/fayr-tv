import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { isDismissed, setDismissed } from "repositories/bannerDismissals";

export type GetBannerDismissalsResponse = { isDismissed: boolean };

type Request = NextApiRequest & { query: { bannerId: string } };

// TODO: These overloads aren't working correctly to typecheck the `res.json(...)` arg
export default async function handler(
    req: Request & { method: "GET" },
    res: NextApiResponse<GetBannerDismissalsResponse>,
): Promise<void>;
export default async function handler(
    req: Request & { method: "POST" },
    res: NextApiResponse<{ ok: boolean }>,
): Promise<void>;
export default async function handler(req: Request, res: NextApiResponse): Promise<void> {
    const session = await getSession({ req });

    const userEmail = session?.user?.email;

    if (!userEmail) {
        res.status(403).json({ ok: false, message: "Please login first" });
        return;
    }

    const { bannerId } = req.query;

    switch (req.method) {
        case "POST":
            await setDismissed({ bannerId, userId: userEmail });
            res.status(200).json({ ok: true });
            return;
        case "GET":
            res.status(200).json({
                isDismissed: await isDismissed({ bannerId, userId: userEmail }),
            } as GetBannerDismissalsResponse);
            return;
    }
}
