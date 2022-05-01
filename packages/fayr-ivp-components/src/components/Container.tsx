import { useEditor, useNode } from "@craftjs/core";
import React from "react";

import { withCraft } from "./craftTypes";

type ContainerProps = {
    padding: number;
    background: string;
};

const Container = ({ background, padding, children }: React.PropsWithChildren<ContainerProps>) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    return (
        <div
            ref={(ref: any) => (enabled ? connect(drag(ref)) : connect(ref))}
            style={{ margin: "5px 0", background, padding: `${padding}px` }}
        >
            {children}
        </div>
    );
};

export default withCraft(Container);
