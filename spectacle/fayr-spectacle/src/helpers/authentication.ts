import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { withSSRContext } from "aws-amplify";
import { convertAwsModelToUser } from "./awsModelParser";

export const ssrGetUser = async (req: { cookies: NextApiRequestCookies }) => {
    const SSR = withSSRContext({ req });
    const userInfo = await SSR.Auth.currentUserInfo();

    if (!userInfo?.attributes) {
        return null;
    }

    return convertAwsModelToUser(userInfo);
};
