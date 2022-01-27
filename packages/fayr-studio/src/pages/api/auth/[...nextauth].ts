import Fauna from "adapters/fauna";
import { env } from "constants/env";
import { getFaunaClient } from "database";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

type GitHubEmailResponse = {
    email: string;
    primary: boolean;
    verified: true;
    visibility: string | null;
};

export default NextAuth({
    providers: [
        Providers.Email({
            server: env.EMAIL_SERVER,
            from: env.EMAIL_FROM,
        }),
        Providers.GitHub({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
            scope: "user:email",
            profile: async (profileData, tokens) => {
                const name = (profileData.name ?? profileData.login) as string;
                const { accessToken } = tokens;
                const emails: GitHubEmailResponse[] = await fetch(
                    "https://api.github.com/user/emails",
                    {
                        headers: {
                            Authorization: `token ${accessToken}`,
                        },
                    },
                ).then((res) => res.json());
                const primaryEmail = (emails.find((e: GitHubEmailResponse) => e.primary)?.email ??
                    profileData.email) as string;
                return {
                    id: profileData.id as string,
                    name,
                    email: primaryEmail,
                    image: profileData.avatar_url as string,
                    username: profileData.login as string,
                };
            },
        }),
        // https://next-auth.js.org/providers/cognito
        Providers.Cognito({
            clientId: env.COGNITO_CLIENT_ID,
            clientSecret: env.COGNITO_CLIENT_SECRET,
            domain: env.COGNITO_DOMAIN,
            profile: async (profileData) => {
                return {
                    id: profileData.sub as string,
                    name: profileData.email,
                    email: profileData.email,
                    image: null,
                    username: profileData.username as string,
                };
            },
        }),
    ],
    secret: env.SECRET,
    adapter: Fauna.Adapter({ faunaClient: getFaunaClient() }),
    callbacks: {
        session: async (session, user) => {
            return Promise.resolve({
                ...session,
                user: {
                    ...user,
                },
            });
        },
    },
});
