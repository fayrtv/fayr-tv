import LibraryQRCode from "qrcode-svg";
import React from "react";
import { RefractionProtocol } from "~/models";

export const QRCode = (props: LibraryQRCode.Options) => {
    const qrCodeHtml = React.useMemo(() => {
        return new LibraryQRCode(props).svg();
    }, [props]);

    return <div className="inline-block" dangerouslySetInnerHTML={{ __html: qrCodeHtml }} />;
};

type Props = Omit<LibraryQRCode.Options, "content"> & {
    refractionProtocol: RefractionProtocol;
};

export const RefractionProtocolQRCode = ({ refractionProtocol, ...props }: Props) => {
    const content = JSON.stringify(refractionProtocol);
    return <QRCode content={content} {...props} />;
};
