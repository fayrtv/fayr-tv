// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { RefractionProtocol, Customer, Appointment, Store } = initSchema(schema);

export {
  RefractionProtocol,
  Customer,
  Appointment,
  Store
};