import { useNode } from "@craftjs/core";
import { Container } from "@fayr/ivp-components";
import Slider from "components/Slider";
import ColorPicker from "components/ivp-designer/ColorPicker";
import React from "react";

type Props = React.ComponentProps<typeof Container>;

export const ContainerSettings = () => {
    const {
        background,
        padding,
        actions: { setProp },
    } = useNode<Props>((node) => node.data.props as Props);

    return (
        <div className="text-neutral flex-col">
            <div>
                Background
                <ColorPicker
                    name="background-color"
                    color={background}
                    onChange={(color) => setProp((props: Props) => (props.background = color), 500)}
                />
            </div>
            <div>
                Padding
                <Slider
                    defaultValue={padding}
                    onChange={(value) =>
                        setProp((props: Props) => (props.padding = Number(value)), 500)
                    }
                />
            </div>
        </div>
    );
};

export const ContainerDefaultProps = {
    background: "#ffffff",
    padding: 3,
};
