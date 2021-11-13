import React from "react";
import QRCode from "qrcode-svg";

type Props = QRCode.Options;

export default function QRCodeView(props: Props) {
    const qrCodeHtml = React.useMemo(() => {
        return new QRCode(props).svg();
    }, [props]);

    return <div dangerouslySetInnerHTML={{ __html: qrCodeHtml }} />;
}
