import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type RefractionProtocolMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AppointmentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type StoreMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class RefractionProtocol {
  readonly id: string;
  readonly userID: string;
  readonly data: string;
  readonly recordedAt: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<RefractionProtocol, RefractionProtocolMetaData>);
  static copyOf(source: RefractionProtocol, mutator: (draft: MutableModel<RefractionProtocol, RefractionProtocolMetaData>) => MutableModel<RefractionProtocol, RefractionProtocolMetaData> | void): RefractionProtocol;
}

export declare class Customer {
  readonly id: string;
  readonly storeID: string;
  readonly ProtocolHistory?: (RefractionProtocol | null)[] | null;
  readonly userID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Customer, CustomerMetaData>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer, CustomerMetaData>) => MutableModel<Customer, CustomerMetaData> | void): Customer;
}

export declare class Appointment {
  readonly id: string;
  readonly User?: Customer | null;
  readonly beginDate: string;
  readonly AtStore?: Store | null;
  readonly endDate?: string | null;
  readonly message?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly appointmentUserId?: string | null;
  readonly appointmentAtStoreId?: string | null;
  constructor(init: ModelInit<Appointment, AppointmentMetaData>);
  static copyOf(source: Appointment, mutator: (draft: MutableModel<Appointment, AppointmentMetaData>) => MutableModel<Appointment, AppointmentMetaData> | void): Appointment;
}

export declare class Store {
  readonly id: string;
  readonly AdminUsers?: (Customer | null)[] | null;
  readonly name: string;
  readonly city: string;
  readonly owner: string;
  readonly fullAddress: string;
  readonly phoneNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Store, StoreMetaData>);
  static copyOf(source: Store, mutator: (draft: MutableModel<Store, StoreMetaData>) => MutableModel<Store, StoreMetaData> | void): Store;
}