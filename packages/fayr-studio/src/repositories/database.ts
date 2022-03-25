import { Model, ModelOptions } from "@peak-ai/jedlik";
import { env } from "constants/env";
import { ObjectSchema } from "joi";

export type TableRecord = {
    pk: string;
    sk: string;
};

export function createModel<T extends TableRecord>(
    schema?: ModelOptions<T>["schema"] | ObjectSchema<T>,
) {
    return new Model<T>(
        {
            table: env.TABLE_NAME,
            // @ts-ignore
            schema: schema ?? { validate: (item: T) => ({ value: item, error: undefined }) },
        },
        { region: env.TABLE_REGION },
    );
}
