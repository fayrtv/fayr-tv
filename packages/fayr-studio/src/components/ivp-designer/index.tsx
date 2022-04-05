import { Editor, Element, Frame } from "@craftjs/core";
import { SaveLoadActions } from "components/ivp-designer/SaveLoadActions";
import { SelectedElementPropertiesPanel } from "components/ivp-designer/SelectedElementPropertiesPanel";
import { Button } from "components/user/Button";
import { Card, CardBottom, CardTop } from "components/user/Card";
import { Container } from "components/user/Container";
import { Text } from "components/user/Text";
import React from "react";

const IVPDesigner = () => {
    return (
        <>
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
                    <div>
                        <div className="h-full lg:w-80">
                            <div className="h-full relative p-2 p-2 inset-0 border-2 border-gray-200 border-dashed rounded-lg">
                                {/*<Toolbox />*/}
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
                </div>
            </Editor>
        </>
    );
};

export default IVPDesigner;
