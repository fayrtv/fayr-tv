export const env = {
    IS_IN_PRODUCTION: process.env.NODE_ENV === "production",
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET as string,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER as string,
} as const;

