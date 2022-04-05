import { Theme, mapTheme } from "./themeMapping";

export const applyTheme = (theme: Theme, applyOn: HTMLElement = document.documentElement): void => {
    const mappedTheme = mapTheme(theme);
    if (!mappedTheme) {
        return;
    }

    if (applyOn?.style === undefined) {
        throw Error("Element to apply style on was not found.");
    }

    Object.keys(mappedTheme).forEach((property) => {
        if (property === "name") {
            return;
        }

        applyOn.style.setProperty(property, mappedTheme[property]);
    });
};
