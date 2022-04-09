import { useNode } from "@craftjs/core";
import { Text } from "@fayr/ivp-components";
import Slider from "components/Slider";
import { isArrayLike } from "lodash";
import React from "react";

type Props = React.ComponentProps<typeof Text>;

export const TextSettings = () => {
    const {
        actions: { setProp },
        fontSize,
    } = useNode((node) => ({
        text: node.data.props.text,
        fontSize: node.data.props.fontSize,
    }));

    return (
        <div className="flex-col">
            <div>
                Font Size
                <Slider
                    value={fontSize || 7}
                    step={2}
                    min={8}
                    max={50}
                    onChange={(value) =>
                        setProp(
                            (props: Props) =>
                                (props.fontSize = isArrayLike(value) ? value[0] : value),
                            1000,
                        )
                    }
                />
            </div>
        </div>
    );
};

export const TextDefaultProps = {
    text: "Hi",
    fontSize: 20,
};
