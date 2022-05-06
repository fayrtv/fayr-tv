// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Appointment, ShopOwner, Shop, Tenant } = initSchema(schema);

export {
  User,
  Appointment,
  ShopOwner,
  Shop,
  Tenant
};