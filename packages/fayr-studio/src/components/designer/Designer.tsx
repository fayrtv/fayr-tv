import { Editor, Element, Frame } from "@craftjs/core";
import { SaveLoadActions } from "components/SaveLoadActions";
import { SettingsPanel } from "components/SettingsPanel";
import { Toolbox } from "components/Toolbox";
import Layout from "components/layout/Layout";
import { Button } from "components/user/Button";
import { Card, CardBottom, CardTop } from "components/user/Card";
import { Container } from "components/user/Container";
import { Text } from "components/user/Text";
import React, { FunctionComponent } from "react";

interface OwnProps {}

type Props = OwnProps;

const Designer: FunctionComponent<Props> = (props) => {
    return (
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
            <Toolbox />
            <SettingsPanel />
            <SaveLoadActions />
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
                    <Button text="Der Watch Party beitreten" size="small" data-cy="frame-button" />
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
        </Editor>
    );
};

export default Designer;
