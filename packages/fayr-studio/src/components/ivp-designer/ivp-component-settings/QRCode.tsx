import { useNode } from "@craftjs/core";
import { QRCode } from "@fayr/ivp-components";
import ColorPicker from "components/ivp-designer/ColorPicker";
import React from "react";

type Props = React.ComponentProps<typeof QRCode>;

export const QRCodeSettings = () => {
    const {
        actions: { setProp },
        color,
        content,
    } = useNode<Props>((node) => node.data.props as Props);

    return (
        <div className="flex-col text-neutral">
            <div>
                <input
                    type="text"
                    value={content}
                    onChange={(ev) => setProp((props: Props) => (props.content = ev.target.value))}
                />
                Content
            </div>
            <div>
                <ColorPicker
                    name="test2"
                    color={color ?? "#ffffff"}
                    onChange={(newValue) => setProp((props: Props) => (props.color = newValue))}
                />
                Foreground Color
            </div>
        </div>
    );
};

export const QRCodeDefaultProps: Props = {
    color: "#ffffff",
    content: "hello world",
};
