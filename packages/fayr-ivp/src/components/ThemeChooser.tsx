import React from "react";

import { applyTheme, FAYR_THEME, RAINBOW_THEME } from "@fayr/shared-components";

const ThemeChooser = () => {
    const selectableThemes = [FAYR_THEME, RAINBOW_THEME];
    const [theme, setTheme] = React.useState(FAYR_THEME);

    React.useEffect(() => {
        applyTheme(theme, document.documentElement);
    }, [theme]);

    return (
        <select
            onChange={(option) => {
                const newTheme = selectableThemes.find((t) => t.id === option.target.value);
                if (newTheme) {
                    setTheme(newTheme);
                }
            }}
            value={theme.id}
        >
            {selectableThemes.map((t) => (
                <option key={t.id} value={t.id}>
                    {t.id}
                </option>
            ))}
        </select>
    );
};

export default ThemeChooser;
