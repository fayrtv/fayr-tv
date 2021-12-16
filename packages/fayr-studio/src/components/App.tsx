import "../assets/styles.css";
import Layout from "./Layout";
import { SaveLoadActions } from "./SaveLoadActions";
import { SettingsPanel } from "./SettingsPanel";
import { Toolbox } from "./Toolbox";
import { Button } from "./user/Button";
import { Card, CardBottom, CardTop } from "./user/Card";
import { Container } from "./user/Container";
import { Text } from "./user/Text";
import { Editor, Element, Frame } from "@craftjs/core";
import React from "react";

export default function App() {
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
                <Layout
                    main={
                        <>
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
                        </>
                    }
                    sidebar={
                        <>
                            <Toolbox />
                            <SettingsPanel />
                            <SaveLoadActions />
                        </>
                    }
                />
            </Editor>
        </>
    );
}
