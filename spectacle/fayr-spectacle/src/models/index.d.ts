import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

type RefractionProtocolMetaData = {
    readOnlyFields: "createdAt" | "updatedAt";
};

type UserMetaData = {
    readOnlyFields: "createdAt" | "updatedAt";
};

type AppointmentMetaData = {
    readOnlyFields: "createdAt" | "updatedAt";
};

type ShopMetaData = {
    readOnlyFields: "createdAt" | "updatedAt";
};

type ShopOwnerMetaData = {
    readOnlyFields: "createdAt" | "updatedAt";
};

export declare class RefractionProtocol {
    readonly id: string;
    readonly userID: string;
    readonly data: string;
    readonly recordedAt: string;
    readonly createdAt?: string | null;
    readonly updatedAt?: string | null;
    constructor(init: ModelInit<RefractionProtocol, RefractionProtocolMetaData>);
    static copyOf(
        source: RefractionProtocol,
        mutator: (
            draft: MutableModel<RefractionProtocol, RefractionProtocolMetaData>,
        ) => MutableModel<RefractionProtocol, RefractionProtocolMetaData> | void,
    ): RefractionProtocol;
}

export declare class User {
    readonly id: string;
    readonly shopID: string;
    readonly ProtocolHistory?: (RefractionProtocol | null)[] | null;
    readonly createdAt?: string | null;
    readonly updatedAt?: string | null;
    constructor(init: ModelInit<User, UserMetaData>);
    static copyOf(
        source: User,
        mutator: (
            draft: MutableModel<User, UserMetaData>,
        ) => MutableModel<User, UserMetaData> | void,
    ): User;
}

export declare class Appointment {
    readonly id: string;
    readonly User?: User | null;
    readonly date: string;
    readonly Location?: Shop | null;
    readonly createdAt?: string | null;
    readonly updatedAt?: string | null;
    readonly appointmentUserId?: string | null;
    readonly appointmentLocationId?: string | null;
    constructor(init: ModelInit<Appointment, AppointmentMetaData>);
    static copyOf(
        source: Appointment,
        mutator: (
            draft: MutableModel<Appointment, AppointmentMetaData>,
        ) => MutableModel<Appointment, AppointmentMetaData> | void,
    ): Appointment;
}

export declare class Shop {
    readonly id: string;
    readonly AdminUsers?: (User | null)[] | null;
    readonly createdAt?: string | null;
    readonly updatedAt?: string | null;
    constructor(init: ModelInit<Shop, ShopMetaData>);
    static copyOf(
        source: Shop,
        mutator: (
            draft: MutableModel<Shop, ShopMetaData>,
        ) => MutableModel<Shop, ShopMetaData> | void,
    ): Shop;
}

export declare class ShopOwner {
    readonly id: string;
    readonly firstName?: string | null;
    readonly lastName?: string | null;
    readonly createdAt?: string | null;
    readonly updatedAt?: string | null;
    constructor(init: ModelInit<ShopOwner, ShopOwnerMetaData>);
    static copyOf(
        source: ShopOwner,
        mutator: (
            draft: MutableModel<ShopOwner, ShopOwnerMetaData>,
        ) => MutableModel<ShopOwner, ShopOwnerMetaData> | void,
    ): ShopOwner;
}
