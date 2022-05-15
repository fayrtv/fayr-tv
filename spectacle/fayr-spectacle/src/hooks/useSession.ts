import { Auth } from "aws-amplify";
import { convertAmplifyAuthUser } from "~/helpers/authentication";
import { useQuery } from "react-query";

export const useSession = () => {
    const { isLoading, data: user } = useQuery("get-user", async () => {
        const userInfo = await Auth.currentUserInfo();
        return userInfo?.attributes ? convertAmplifyAuthUser(userInfo) : undefined;
    });
    return { isLoading, user };
};
