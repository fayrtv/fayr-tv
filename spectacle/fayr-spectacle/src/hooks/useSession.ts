import { Auth } from "aws-amplify";
import { createUserFromAttributes } from "~/helpers/authentication";
import { useQuery } from "react-query";

export const useSession = () => {
    const { isLoading, data: user } = useQuery("get-user", async () => {
        const userInfo = await Auth.currentUserInfo();
        return userInfo?.attributes ? createUserFromAttributes(userInfo.attributes) : undefined;
    });
    return { isLoading, user };
};
