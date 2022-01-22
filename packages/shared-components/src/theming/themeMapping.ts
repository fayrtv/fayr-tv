export interface ITheme {
    colorBackground: string;
    colorNeutral: string;
    colorWhite: string;
    colorPrimary: string;
    colorPrimaryDark: string;
    colorPrimaryLight: string;
    colorGray: string;
    colorBlueish: string;
}

export interface IMappedTheme {
    [key: string]: string | "";
}

export const mapTheme = (variables: ITheme): IMappedTheme => {
    return {
        "--color-background": variables.colorBackground || "",
        "--color-neutral": variables.colorNeutral || "",
        "--color-white": variables.colorWhite || "",
        "--color-primary": variables.colorPrimary || "",
        "--color-primary-dark": variables.colorPrimaryDark || "",
        "--color-primary-light": variables.colorPrimaryLight || "",
        "--color-gray": variables.colorGray || "",
        "--color-blueish": variables.colorBlueish || "",
    };
};
