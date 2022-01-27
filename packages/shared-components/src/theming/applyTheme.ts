import { IMappedTheme, ITheme, mapTheme } from "./themeMapping";

export const applyTheme = (
    theme: ITheme,
    applyOn: HTMLElement = document.documentElement,
): void => {
    const mappedTheme = mapTheme(theme);
    if (!mappedTheme) {
        return;
    }

    Object.keys(mappedTheme).forEach((property) => {
        if (property === "name") {
            return;
        }

        applyOn.style.setProperty(property, mappedTheme[property]);
    });
};