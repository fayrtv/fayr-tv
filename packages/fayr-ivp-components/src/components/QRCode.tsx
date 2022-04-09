import { useNode } from "@craftjs/core";
import * as LibraryQRCode from "qrcode-svg";
import React from "react";

import { withCraft } from "./craftTypes";

type Props = LibraryQRCode.Options;

const QRCode = (props: Props) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const qrCodeHtml = React.useMemo(() => {
        return new LibraryQRCode(props).svg();
    }, [props]);

    return (
        <div
            className="inline-block"
            ref={(ref) => connect(drag(ref))}
            dangerouslySetInnerHTML={{ __html: qrCodeHtml }}
        />
    );
};

export default withCraft(QRCode);
