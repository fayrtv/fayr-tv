import { applyTheme, FAYR_THEME, Theme } from "@fayr/shared-components";
import ColorPicker from "components/ivp-designer/ColorPicker";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import React from "react";

export function ThemeSettingsContainer() {
    const { styling, setStyling } = React.useContext(PlatformConfiguratorContext);

    React.useEffect(() => {
        applyTheme(styling?.theme ?? FAYR_THEME, document.getElementById("fayr-studio-root")!);
    }, [styling.theme]);

    const setThemeColor = React.useCallback(
        (colorKey: keyof Theme, value: string) => {
            // TODO: oof...
            setStyling((curr) => ({
                ...curr,
                ...{ theme: { ...curr.theme, ...{ [colorKey]: value } } },
            }));
        },
        [setStyling],
    );

    return (
        <div className="flex flex-col">
            {Object.entries(styling.theme)
                .filter(([key, _]) => key !== "id")
                .map(([colorKey, color]) => (
                    <div key={colorKey}>
                        <label htmlFor={colorKey} className="block text-sm font-medium">
                            {colorKey.replace("color", "")}
                        </label>
                        <ColorPicker
                            name={colorKey}
                            color={color}
                            onChange={(newValue) =>
                                setThemeColor(colorKey as keyof Theme, newValue)
                            }
                        />
                    </div>
                ))}
        </div>
    );
}
