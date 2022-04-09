import { useNode } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

import { withCraft } from "./craftTypes";

type Props = {
    text: string;
    fontSize?: string | number;
    textAlign?: string;
    color?: "primary";
};

const Text = ({ text, fontSize, color, textAlign, ...props }: Props) => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp },
    } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
    }));

    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (selected) {
            return;
        }

        setEditable(false);
    }, [selected]);

    return (
        <div
            {...props}
            ref={(ref) => connect(drag(ref!))}
            onClick={() => selected && setEditable(true)}
        >
            <ContentEditable
                html={text}
                disabled={!editable}
                onChange={(e) =>
                    setProp(
                        (props: Props) =>
                            (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
                        500,
                    )
                }
                tagName="p"
                style={{ fontSize: `${fontSize}px`, textAlign }}
            />
        </div>
    );
};

export default withCraft(Text);
