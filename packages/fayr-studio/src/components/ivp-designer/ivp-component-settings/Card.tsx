import { Element, useNode } from "@craftjs/core";
import { Container, Text } from "@fayr/ivp-components";
import { Button } from "components/ivp-designer/ivp-component-settings/Button";
import {
    ContainerDefaultProps,
    ContainerSettings,
} from "components/ivp-designer/ivp-component-settings/Container";
import React from "react";

type CardTopProps = {};

export const CardTop = ({ children, ...props }: React.PropsWithChildren<CardTopProps>) => {
    const {
        connectors: { connect },
    } = useNode();
    return (
        <div
            {...props}
            // @ts-ignore
            ref={connect}
            className="text-only"
            style={{
                padding: "10px",
                marginBottom: "10px",
                borderBottom: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            {children}
        </div>
    );
};

CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes: any[]) =>
            incomingNodes.every((incomingNode) => incomingNode.data.type === Text),
    },
};

type CardBottomProps = {};

export const CardBottom = ({ children, ...props }: React.PropsWithChildren<CardBottomProps>) => {
    const {
        connectors: { connect },
    } = useNode();
    return (
        // @ts-ignore
        <div {...props} style={{ padding: "10px 0" }} ref={connect}>
            {children}
        </div>
    );
};

CardBottom.craft = {
    rules: {
        canMoveIn: (incomingNodes: any[]) =>
            incomingNodes.every((incomingNode) => incomingNode.data.type === Button),
    },
};

type CardProps = {
    background?: string;
    padding?: number;
};

export const Card = ({ background, padding = 20, ...props }: CardProps) => (
    <Container {...props} background={background ?? "black"} padding={padding}>
        <Element canvas id="text" is={CardTop} data-cy="card-top">
            <Text text="Only texts" fontSize={20} data-cy="card-top-text-1" />
            <Text text="are allowed up here" fontSize={15} data-cy="card-top-text-2" />
        </Element>
        <Element canvas id="buttons" is={CardBottom} data-cy="card-bottom">
            <Button size="small" text="Only buttons down here" data-cy="card-bottom-button" />
        </Element>
    </Container>
);

Card.craft = {
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
};
