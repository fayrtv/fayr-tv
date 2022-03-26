import { Editor, Element, Frame } from "@craftjs/core";
import { applyTheme, FAYR_THEME, Theme } from "@fayr/shared-components";
import { SaveLoadActions } from "components/SaveLoadActions";
import { SettingsPanel } from "components/SettingsPanel";
import { Toolbox } from "components/Toolbox";
import ColorPicker from "components/designer/ColorPicker";
import { Button } from "components/user/Button";
import { Card, CardBottom, CardTop } from "components/user/Card";
import { Container } from "components/user/Container";
import { Text } from "components/user/Text";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import React from "react";

const IVPDesigner = () => {
    const { styling, setStyling } = React.useContext(PlatformConfiguratorContext);

    React.useEffect(() => {
        applyTheme(styling.theme, document.getElementById("fayr-studio-root")!);
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
        <>
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
            <Editor
                resolver={{
                    Card,
                    Button,
                    Text,
                    Container,
                    CardTop,
                    CardBottom,
                }}
            >
                <div className="flex-grow w-full lg:flex">
                    <div className="flex-1 min-w-0 xl:flex">
                        <div className="lg:min-w-0 lg:flex-1">
                            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                                {/* Start main area*/}
                                <div className="relative h-full" style={{ minHeight: "36rem" }}>
                                    <div className="absolute inset-0 border-2 border-gray-200 border-dashed rounded-lg" />
                                    <Frame>
                                        <Element
                                            canvas
                                            is={Container}
                                            padding={5}
                                            background="#eeeeee"
                                            data-cy="root-container"
                                        >
                                            {/*<Card data-cy="frame-card" />*/}
                                            <Text
                                                fontSize="large"
                                                color="primary"
                                                text="It's me again!"
                                                data-cy="frame-container-text"
                                            />
                                            <Button
                                                text="Der Watch Party beitreten"
                                                size="small"
                                                data-cy="frame-button"
                                            />
                                            <Text
                                                fontSize={20}
                                                text="Fiebere zusammen mit deinen Freunden bei diesem Event mit!"
                                                data-cy="frame-text"
                                            />
                                            <Element
                                                canvas
                                                is={Container}
                                                padding={6}
                                                background="#999999"
                                                data-cy="frame-container"
                                            >
                                                <Text
                                                    fontSize="small"
                                                    text="It's me again!"
                                                    data-cy="frame-container-text"
                                                />
                                            </Element>
                                        </Element>
                                    </Frame>
                                </div>
                                {/* End main area */}
                            </div>
                        </div>
                    </div>

                    <div className="pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                        <div className="h-full pl-6 py-6 lg:w-80">
                            {/* Start right column area */}
                            <div className="h-full relative" style={{ minHeight: "16rem" }}>
                                <div className="absolute inset-0 border-2 border-gray-200 border-dashed rounded-lg" />
                                <Toolbox />
                                <SaveLoadActions />
                                <SettingsPanel />
                            </div>
                            {/* End right column area */}
                        </div>
                    </div>
                </div>
            </Editor>
        </>
    );
};

export default IVPDesigner;
