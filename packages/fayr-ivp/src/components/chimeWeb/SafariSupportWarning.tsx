import { getParser } from "bowser";
import React from "react";

import { Flex } from "@fayr/common";

import styles from "./SafariSupportWarning.module.scss";

import { useIsMobile } from "../mediaQueries";

const ConditionalSafariSupportWarning = () => {
    const [acknowledged, setAcknowledged] = React.useState(false);

    const isSafari = React.useMemo(() => {
        const parser = getParser(window.navigator.userAgent);

        return parser.satisfies({
            macos: {
                safari: ">1",
            },
            mobile: {
                safari: ">1",
            },
        });
    }, []);

    if (!isSafari || acknowledged) {
        return null;
    }

    return <SafariSupportWarning onClose={() => setAcknowledged(true)} />;
};

type Props = {
    onClose: () => void;
};

const SafariSupportWarning = ({ onClose }: Props) => {
    const isMobile = useIsMobile();

    return (
        <div className={styles.SafariSupportWarningContainer}>
            <Flex className={styles.SafariSupportWarning} direction="Column" crossAlign="Center">
                <h1>Browser nicht unterstützt</h1>
                <p>
                    Leider wird dein Browser von uns noch nicht vollständig unterstützt. Wir
                    empfehlen dir Google Chrome zu nutzen, damit die Watch Party problemlos
                    funktioniert
                </p>
                <p>Chrome kannst du ganz einfach hier herunterladen:</p>
                <a
                    target="_blank"
                    href={
                        isMobile
                            ? "https://play.google.com/store/apps/details?id=com.android.chrome"
                            : "https://www.google.com/chrome/"
                    }
                >
                    Download
                </a>
                <button onClick={onClose}>
                    <u>Trotzdem weiter</u>
                </button>
            </Flex>
        </div>
    );
};

export default ConditionalSafariSupportWarning;
