import { IMappedTheme, ITheme, mapTheme } from "./themeMapping";

export const applyTheme = (theme: ITheme): void => {
    const themeObject: IMappedTheme = mapTheme(theme);
    if (!themeObject) {
        return;
    }

    // TODO: Experiment whether setting this on a non-root node (e.g. whatever comes first in App.tsx)
    //  will also work. In that case, pass that element as argument.
    const root = document.documentElement;

    Object.keys(themeObject).forEach((property) => {
        if (property === "name") {
            return;
        }

        root.style.setProperty(property, themeObject[property]);
    });
};
