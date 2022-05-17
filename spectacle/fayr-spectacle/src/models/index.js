// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { RefractionProtocol, User, Appointment, Shop, ShopOwner } = initSchema(schema);

export {
  RefractionProtocol,
  User,
  Appointment,
  Shop,
  ShopOwner
};