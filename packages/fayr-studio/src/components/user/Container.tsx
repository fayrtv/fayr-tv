import { NodeData, useNode } from "@craftjs/core";
import { Slider } from "@material-ui/core";
import { Paper, FormControl, FormLabel } from "@material-ui/core";
import ColorPicker from "material-ui-color-picker";
import React from "react";

type Props = {
    padding: number;
    background?: string;
};

export const Container = ({
    background,
    padding,
    children,
    ...props
}: React.PropsWithChildren<Props>) => {
    const {
        connectors: { connect, drag },
    } = useNode();
    return (
        <Paper
            {...props}
            ref={(ref: any) => connect(drag(ref))}
            style={{ margin: "5px 0", background, padding: `${padding}px` }}
        >
            {children}
        </Paper>
    );
};

export const ContainerSettings = () => {
    const {
        background,
        padding,
        actions: { setProp },
    } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
    }));

    return (
        <div>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Background</FormLabel>
                <ColorPicker
                    name="background-color"
                    value={background}
                    onChange={(color) => {
                        setProp((props: NodeData["props"]) => (props.background = color), 500);
                    }}
                />
            </FormControl>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Padding</FormLabel>
                <Slider
                    defaultValue={padding}
                    onChange={(_, value) =>
                        setProp((props: NodeData["props"]) => (props.padding = value), 500)
                    }
                />
            </FormControl>
        </div>
    );
};

export const ContainerDefaultProps = {
    background: "#ffffff",
    padding: 3,
};

Container.craft = {
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
};
