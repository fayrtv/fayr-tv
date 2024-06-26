import { Model, ModelOptions } from "@peak-ai/jedlik";
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
            // TODO: make this generic (again)
            table: "Platforms",
            // @ts-ignore
            schema: schema ?? { validate: (item: T) => ({ value: item, error: undefined }) },
        },
        { region: process.env.TABLE_REGION },
    );
}
