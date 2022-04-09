import { Editor, Element, Frame } from "@craftjs/core";
import { QueryMethods } from "@craftjs/core/lib/editor/query";
import { QueryCallbacksFor } from "@craftjs/utils";
import { Container, IVP_COMPONENT_RESOLVER, QRCode, Text } from "@fayr/ivp-components";
import ErrorBoundary from "components/ErrorBoundary";
import { SaveLoadActions } from "components/ivp-designer/SaveLoadActions";
import { SelectedElementPropertiesPanel } from "components/ivp-designer/SelectedElementPropertiesPanel";
import { Toolbox } from "components/ivp-designer/Toolbox";
import {
    ContainerDefaultProps,
    ContainerSettings,
} from "components/ivp-designer/ivp-component-settings/Container";
import {
    QRCodeDefaultProps,
    QRCodeSettings,
} from "components/ivp-designer/ivp-component-settings/QRCode";
import {
    TextDefaultProps,
    TextSettings,
} from "components/ivp-designer/ivp-component-settings/Text";
import lz from "lzutf8";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import React from "react";

//#region Link CraftJS components (only once)

QRCode.craft = {
    props: QRCodeDefaultProps,
    related: {
        settings: QRCodeSettings,
    },
};

Container.craft = {
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
};

Text.craft = {
    props: TextDefaultProps,
    related: {
        settings: TextSettings,
    },
};

//#endregion

const IVPDesigner = () => {
    const { styling, setStyling } = React.useContext(PlatformConfiguratorContext);

    const frameData = React.useMemo(() => {
        if (!styling?.craftData) {
            return undefined;
        }
        return lz.decompress(lz.decodeBase64(styling.craftData));
    }, [styling?.craftData]);

    return (
        <ErrorBoundary>
            <Editor
                onNodesChange={(query: QueryCallbacksFor<typeof QueryMethods>) => {
                    const json = query.serialize();
                    const craftData = lz.encodeBase64(lz.compress(json));
                    setStyling({ craftData, theme: styling.theme });
                }}
                resolver={IVP_COMPONENT_RESOLVER}
            >
                <div className="flex-grow w-full lg:flex">
                    <div>
                        <div className="h-full lg:w-80">
                            <div className="h-full relative p-2 p-2 inset-0 border-2 border-gray-200 border-dashed rounded-lg">
                                <Toolbox />
                                <SelectedElementPropertiesPanel />
                                <SaveLoadActions />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 xl:flex sm:mx-5 lg:mx-5">
                        <div className="lg:min-w-0 lg:flex-1">
                            <div className="h-full ">
                                {/* Start main area*/}
                                <div className="relative h-full" style={{ minHeight: "36rem" }}>
                                    {/*<div className="absolute inset-0 border-2 border-gray-200 border-dashed rounded-lg" />*/}
                                    <Frame data={frameData}>
                                        <Element
                                            canvas
                                            is={Container}
                                            padding={5}
                                            background="#eeeeee"
                                            data-cy="root-container"
                                        >
                                            <Text
                                                fontSize={20}
                                                text="Fiebere zusammen mit deinen Freunden bei diesem Event mit!"
                                                data-cy="frame-text"
                                            />
                                            <QRCode content="hello world" color="red" />
                                            {/*<Text*/}
                                            {/*    fontSize="large"*/}
                                            {/*    color="primary"*/}
                                            {/*    text="It's me again!"*/}
                                            {/*    data-cy="frame-container-text"*/}
                                            {/*/>*/}
                                            {/*<Button*/}
                                            {/*    text="Der Watch Party beitreten"*/}
                                            {/*    size="small"*/}
                                            {/*    data-cy="frame-button"*/}
                                            {/*/>*/}

                                            {/*<Element*/}
                                            {/*    canvas*/}
                                            {/*    is={Container}*/}
                                            {/*    padding={6}*/}
                                            {/*    background="#999999"*/}
                                            {/*    data-cy="frame-container"*/}
                                            {/*>*/}
                                            {/*    <Text*/}
                                            {/*        fontSize="small"*/}
                                            {/*        text="It's me again!"*/}
                                            {/*        data-cy="frame-container-text"*/}
                                            {/*    />*/}
                                            {/*</Element>*/}
                                        </Element>
                                    </Frame>
                                </div>
                                {/* End main area */}
                            </div>
                        </div>
                    </div>
                </div>
            </Editor>
        </ErrorBoundary>
    );
};

export default IVPDesigner;
