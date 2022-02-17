import {
    SplitIncludingDelimiters,
    StringArrayToDelimiterCase,
} from "type-fest/source/delimiter-case";
import { UpperCaseCharacters, WordSeparators } from "type-fest/source/utilities";

//#region Typings
type CSSVariableCase<Value> = Value extends string
    ? `--${StringArrayToDelimiterCase<
          SplitIncludingDelimiters<Value, WordSeparators | UpperCaseCharacters>,
          true,
          WordSeparators,
          UpperCaseCharacters,
          "-"
      >}`
    : Value;

type PropertiesAsCSSVariables<Value> = Value extends Function
    ? Value
    : Value extends Array<infer U>
    ? Value
    : { [K in keyof Value as CSSVariableCase<K>]: Value[K] };
//#endregion

export interface Theme {
    id: string;
    colorBackground: string;
    colorNeutral: string;
    colorWhite: string;
    colorPrimary: string;
    colorPrimaryDark: string;
    colorPrimaryLight: string;
    colorSecondary: string;
    colorTertiary: string;
    colorGray: string;
    colorBlueish: string;
}

export type ThemeCSSVariables = PropertiesAsCSSVariables<Omit<Theme, "id">> & { id: string };

export const mapTheme = (variables: Theme): ThemeCSSVariables => {
    return {
        id: variables.id,
        "--color-background": variables.colorBackground || "",
        "--color-neutral": variables.colorNeutral || "",
        "--color-white": variables.colorWhite || "",
        "--color-primary": variables.colorPrimary || "",
        "--color-primary-dark": variables.colorPrimaryDark || "",
        "--color-primary-light": variables.colorPrimaryLight || "",
        "--color-secondary": variables.colorSecondary,
        "--color-tertiary": variables.colorTertiary,
        "--color-gray": variables.colorGray || "",
        "--color-blueish": variables.colorBlueish || "",
    };
};
