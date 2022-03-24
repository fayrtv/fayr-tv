export const env = {
    IS_IN_PRODUCTION: process.env.NODE_ENV === "production",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET as string,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER as string,

    TABLE_NAME: process.env.TABLE_NAME as string,
    TABLE_REGION: process.env.TABLE_REGION as string,
} as const;
