export const schema = {
    models: {
        RefractionProtocol: {
            name: "RefractionProtocol",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                userID: {
                    name: "userID",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                data: {
                    name: "data",
                    isArray: false,
                    type: "AWSJSON",
                    isRequired: true,
                    attributes: [],
                },
                recordedAt: {
                    name: "recordedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: true,
                    attributes: [],
                },
                createdAt: {
                    name: "createdAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                updatedAt: {
                    name: "updatedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
            },
            syncable: true,
            pluralName: "RefractionProtocols",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "key",
                    properties: {
                        name: "byUser",
                        fields: ["userID"],
                    },
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                allow: "public",
                                operations: ["create", "update", "delete", "read"],
                            },
                        ],
                    },
                },
            ],
        },
        User: {
            name: "User",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                shopID: {
                    name: "shopID",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                ProtocolHistory: {
                    name: "ProtocolHistory",
                    isArray: true,
                    type: {
                        model: "RefractionProtocol",
                    },
                    isRequired: false,
                    attributes: [],
                    isArrayNullable: true,
                    association: {
                        connectionType: "HAS_MANY",
                        associatedWith: "userID",
                    },
                },
                createdAt: {
                    name: "createdAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                updatedAt: {
                    name: "updatedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
            },
            syncable: true,
            pluralName: "Users",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "key",
                    properties: {
                        name: "byShop",
                        fields: ["shopID"],
                    },
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                allow: "public",
                                operations: ["create", "update", "delete", "read"],
                            },
                        ],
                    },
                },
            ],
        },
        Appointment: {
            name: "Appointment",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                User: {
                    name: "User",
                    isArray: false,
                    type: {
                        model: "User",
                    },
                    isRequired: false,
                    attributes: [],
                    association: {
                        connectionType: "HAS_ONE",
                        associatedWith: "id",
                        targetName: "appointmentUserId",
                    },
                },
                date: {
                    name: "date",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: true,
                    attributes: [],
                },
                Location: {
                    name: "Location",
                    isArray: false,
                    type: {
                        model: "Shop",
                    },
                    isRequired: false,
                    attributes: [],
                    association: {
                        connectionType: "HAS_ONE",
                        associatedWith: "id",
                        targetName: "appointmentLocationId",
                    },
                },
                createdAt: {
                    name: "createdAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                updatedAt: {
                    name: "updatedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                appointmentUserId: {
                    name: "appointmentUserId",
                    isArray: false,
                    type: "ID",
                    isRequired: false,
                    attributes: [],
                },
                appointmentLocationId: {
                    name: "appointmentLocationId",
                    isArray: false,
                    type: "ID",
                    isRequired: false,
                    attributes: [],
                },
            },
            syncable: true,
            pluralName: "Appointments",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                allow: "public",
                                operations: ["create", "update", "delete", "read"],
                            },
                        ],
                    },
                },
            ],
        },
        Shop: {
            name: "Shop",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                AdminUsers: {
                    name: "AdminUsers",
                    isArray: true,
                    type: {
                        model: "User",
                    },
                    isRequired: false,
                    attributes: [],
                    isArrayNullable: true,
                    association: {
                        connectionType: "HAS_MANY",
                        associatedWith: "shopID",
                    },
                },
                createdAt: {
                    name: "createdAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                updatedAt: {
                    name: "updatedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
            },
            syncable: true,
            pluralName: "Shops",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                allow: "public",
                                operations: ["create", "update", "delete", "read"],
                            },
                        ],
                    },
                },
            ],
        },
        ShopOwner: {
            name: "ShopOwner",
            fields: {
                id: {
                    name: "id",
                    isArray: false,
                    type: "ID",
                    isRequired: true,
                    attributes: [],
                },
                firstName: {
                    name: "firstName",
                    isArray: false,
                    type: "String",
                    isRequired: false,
                    attributes: [],
                },
                lastName: {
                    name: "lastName",
                    isArray: false,
                    type: "String",
                    isRequired: false,
                    attributes: [],
                },
                createdAt: {
                    name: "createdAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
                updatedAt: {
                    name: "updatedAt",
                    isArray: false,
                    type: "AWSDateTime",
                    isRequired: false,
                    attributes: [],
                    isReadOnly: true,
                },
            },
            syncable: true,
            pluralName: "ShopOwners",
            attributes: [
                {
                    type: "model",
                    properties: {},
                },
                {
                    type: "auth",
                    properties: {
                        rules: [
                            {
                                allow: "public",
                                operations: ["create", "update", "delete", "read"],
                            },
                        ],
                    },
                },
            ],
        },
    },
    enums: {},
    nonModels: {},
    version: "b0132c7c4d8a7701fc96d8db9922a940",
};
