import { QrReader, QrReaderProps } from "react-qr-reader";

type Props = {
    onResult: QrReaderProps["onResult"];
};

export const QRCodeReader = ({ onResult }: Props) => {
    return <QrReader onResult={onResult} constraints={{ facingMode: "environment" }} />;
};
