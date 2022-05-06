import { User } from "~/models/user";

export type Shop = {};
export type ShopOwner = {};
export type Tenant = {
    shop: Shop;
    owner: ShopOwner;
    adminUser: User;
};

export type Appointment = {};
