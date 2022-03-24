import {
    PlatformIdentity,
    PlatformInfo,
    PlatformStyling,
    PlatformType,
} from "@fayr/api-contracts";
import * as Joi from "joi";

import { createModel, TableRecord } from "./database";

export type PlatformConfig = PlatformIdentity & {
    type?: PlatformType;
    info?: PlatformInfo;
    styling?: PlatformStyling;
};

type Model = PlatformConfig & TableRecord;

const schema = Joi.object<Model>({
    pk: Joi.string().required(),
    sk: Joi.string().required(),
    id: Joi.string().required(),
    type: Joi.alternatives(...Object.values(PlatformType)),
    info: Joi.object<PlatformConfig>(),
    styling: Joi.object<PlatformStyling>(),
});

const PlatformConfigs = createModel<Model>(schema);

const keys = (platformId: string) => ({
    pk: "PLATFORM_CONFIG",
    sk: platformId,
});

export const getOrCreate = async (id: string) => {
    const existing = await getById(id);
    if (existing) {
        return existing;
    }
    return await savePartial({ id });
};

export const getById = async (id: string) => {
    try {
        const model = await PlatformConfigs.get(keys(id));
        const { pk, sk, ...result } = model.toObject();
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const savePartial = async (platformConfig: PlatformIdentity & Partial<Model>) => {
    const model = PlatformConfigs.create({ ...platformConfig, ...keys(platformConfig.id) });
    await model.save();
    const { pk, sk, ...result } = model.toObject();
    return result;
};
