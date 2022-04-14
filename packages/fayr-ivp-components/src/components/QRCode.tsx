import { useEditor, useNode } from "@craftjs/core";
import * as LibraryQRCode from "qrcode-svg";
import React from "react";

import { withCraft } from "./craftTypes";

type Props = LibraryQRCode.Options;

const QRCode = (props: Props) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const { enabled } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    const qrCodeHtml = React.useMemo(() => new LibraryQRCode(props).svg(), [props]);

    return (
        <div
            className="inline-block"
            ref={(ref) => (enabled ? connect(drag(ref)) : connect(ref))}
            dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
        />
    );
};

export default withCraft(QRCode);
