// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { RefractionProtocol, User, Appointment, StoreOwner, Store } = initSchema(schema);

export {
  RefractionProtocol,
  User,
  Appointment,
  StoreOwner,
  Store
};