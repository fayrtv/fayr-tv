import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react";

type Props = {
    onError: (err: any) => void;
    onScan: (scan: string) => void;
};

export const QRCodeReader = ({ onError, onScan }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }
        const qrScanner = new QrScanner(videoRef.current, onScan);
        const promise = qrScanner.start();
        return () => {
            try {
                promise.finally(() => qrScanner.destroy());
                qrScanner.destroy();
            } catch (err) {}
        };
    }, [onScan]);

    return <video ref={videoRef}></video>;
};
