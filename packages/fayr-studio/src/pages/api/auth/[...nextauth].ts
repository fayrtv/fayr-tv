import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { env } from "constants/env";
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const dynamoDBConfig: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
    },
    region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(dynamoDBConfig), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
});

export default NextAuth({
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        // https://next-auth.js.org/providers/cognito
        CognitoProvider({
            clientId: env.COGNITO_CLIENT_ID,
            clientSecret: env.COGNITO_CLIENT_SECRET,
            issuer: env.COGNITO_ISSUER,
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
    secret: env.NEXTAUTH_SECRET,
    adapter: DynamoDBAdapter(client, { tableName: "studio_auth" }),
    callbacks: {
        session: async ({ session, user }) => {
            return Promise.resolve({
                ...session,
                user,
            });
        },
    },
});
