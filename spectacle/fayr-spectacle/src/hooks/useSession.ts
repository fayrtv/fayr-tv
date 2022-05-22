import { Auth } from "aws-amplify";
import { useQuery } from "react-query";
import { convertAwsModelToUser } from "~/helpers/awsModelParser";

export const useSession = () => {
    const { isLoading, data: user } = useQuery("get-user", async () => {
        const userInfo = await Auth.currentUserInfo();
        return userInfo?.attributes ? convertAwsModelToUser(userInfo) : undefined;
    });
    return { isLoading, user };
};
