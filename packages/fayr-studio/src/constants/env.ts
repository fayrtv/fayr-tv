export const env = {
    IS_IN_PRODUCTION: process.env.NODE_ENV === "production",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
    GITHUB_ID: process.env.GITHUB_ID as string,
    GITHUB_SECRET: process.env.GITHUB_SECRET as string,
    LINKEDIN_ID: process.env.LINKEDIN_ID as string,
    LINKEDIN_SECRET: process.env.LINKEDIN_SECRET as string,
    EMAIL_SERVER: process.env.EMAIL_SERVER as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    USE_FAUNA_DOCKER: process.env.USE_FAUNA_DOCKER as string,
    SECRET: process.env.SECRET as string,
    FAUNADB_SECRET: process.env.FAUNADB_SECRET as string,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET as string,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN as string,
} as const;
