import * as Joi from "joi";
import { createModel, TableRecord } from "repositories/database";

export type BannerDismissal = {
    bannerId: string;
    userId: string;
};

type Model = BannerDismissal & TableRecord;

const schema = Joi.object<Model>({
    pk: Joi.string().required(),
    sk: Joi.string().required(),
    bannerId: Joi.string().required(),
    userId: Joi.string().required(),
});

const BannerDismissals = createModel<Model>(schema);

const keys = (data: BannerDismissal) => ({
    pk: data.userId,
    sk: `BANNER#${data.bannerId}`,
});

export const setDismissed = async (data: BannerDismissal) => {
    try {
        const model = BannerDismissals.create({
            ...data,
            ...keys(data),
        });
        await model.save();
        return model;
    } catch (err) {
        console.log("creation failure");
        console.error(err);
        throw err;
    }
};

export const isDismissed = async (data: BannerDismissal) => {
    try {
        const response = await BannerDismissals.query(keys(data));
        return response?.length;
    } catch (err) {
        console.error(err);
        return false;
    }
};
