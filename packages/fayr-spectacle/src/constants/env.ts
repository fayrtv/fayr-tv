export const env = {
    IS_IN_PRODUCTION: process.env.NODE_ENV === "production",
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET as string,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER as string,
    CALENDLY_ACCESS_TOKEN: process.env.CALENDLY_ACCESS_TOKEN as string,
} as const;

if (!env.CALENDLY_ACCESS_TOKEN) {
    throw new Error("No calendly access token specified in environment variables");
}
