import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
    service: "fayr-api",
    frameworkVersion: "3",
    plugins: ["serverless-esbuild", "serverless-offline"],
    custom: {
        tableName: "Platforms",
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
        },
    },
    package: { individually: true },
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
            TABLE_NAME: "${self:custom.tableName}",
            TABLE_REGION: "us-east-1",
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:UpdateItem",
                ],
                Resource: [{ "Fn::GetAtt": ["PlatformsTable", "Arn"] }],
            },
        ],
    },
    functions: {
        api: {
            // Entry point for all API methods
            handler: `src/lambda.router`,
            events: [
                {
                    http: {
                        method: "any",
                        path: "v1/{route+}",
                    },
                },
            ],
        },
    },
    resources: {
        Resources: {
            PlatformsTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "${self:custom.tableName}",
                    AttributeDefinitions: [
                        { AttributeName: "pk", AttributeType: "S" },
                        { AttributeName: "sk", AttributeType: "S" },
                    ],
                    KeySchema: [
                        { AttributeName: "pk", KeyType: "HASH" },
                        { AttributeName: "sk", KeyType: "RANGE" },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
