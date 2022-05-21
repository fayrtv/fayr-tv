import { ModelInit, PersistentModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { Store, StoreMetaData } from "~/models/index";
import {
    serializeModel as ssrSerializeModel,
    deserializeModel as ssrDeserializeModel,
} from "@aws-amplify/datastore/ssr";

class QuacksLikeAmplifyModelBase {
    constructor(init: ModelInit<Store, StoreMetaData>) {}
    static copyOf() {}
}

type QuacksLikeAmplifyModel = QuacksLikeAmplifyModelBase & { id: string };

export type SerializedModel<T extends QuacksLikeAmplifyModel> = Omit<T, "copyOf" | "new">;

export function serializeModel<T extends QuacksLikeAmplifyModel>(model: T) {
    return ssrSerializeModel(model) as unknown as SerializedModel<T>;
}

/**
 * Note: May return an array
 */
export function deserializeModel<T extends PersistentModel>(
    Model: PersistentModelConstructor<T>,
    init: T | T[],
): typeof Model | Array<typeof Model> {
    return ssrDeserializeModel(Model, init);
}
