import LibraryQRCode from "qrcode-svg";
import React from "react";

type Props = LibraryQRCode.Options;

const QRCode = (props: Props) => {
    const qrCodeHtml = React.useMemo(() => {
        return new LibraryQRCode(props).svg();
    }, [props]);

    return <div className="inline-block" dangerouslySetInnerHTML={{ __html: qrCodeHtml }} />;
};

export default QRCode;
