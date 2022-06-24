import { ThemeIcon, Textarea, Button, Group, Stack, Text } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import React from "react";
import { AlertTriangle, Check, Copy } from "tabler-icons-react";
import { QRCode } from "~/components/QRCode";
import { useAsyncState } from "~/hooks/useAsyncState";
import useBreakpoints from "~/hooks/useBreakpoints";

type ExportModalProps = {
    // TODO: Figure out how to get this working with the apparently much longer RSA key. QR Code lib either throws "too long" or (when attempting to
    // compress with LZString) "Malformed"
    allowQrCode?: boolean;
    keyRetriever: () => Promise<CryptoKey>;
};

export const ExportMenu = ({ allowQrCode = true, keyRetriever }: ExportModalProps) => {
    const clipboard = useClipboard();

    const { isMobile } = useBreakpoints();

    const [copied, setCopied] = React.useState(false);

    const [key, _, keyAvailable] = useAsyncState<string>(async () => {
        const rawSecret = await keyRetriever();
        const exportedKey = await window.crypto.subtle.exportKey("jwk", rawSecret);
        return window.btoa(JSON.stringify(exportedKey));
    });

    if (!keyAvailable) {
        return <p>Lade Schlüssel...</p>;
    }

    return (
        <Stack align="center">
            <Group direction="row" noWrap>
                <ThemeIcon color="yellow" size="xl">
                    <AlertTriangle />
                </ThemeIcon>
                <span>
                    Um ihre per Ende-zu-Ende-Verschlüsselung gesicherten Protokolle auf anderen
                    Geräten einsehen zu können, müssen sie das gerätespezifische Geheimnis dort
                    erneut importieren. Übergeben sie diese Daten nur an Personen, denen sie
                    vertrauen!
                </span>
            </Group>
            <Group spacing="xs" grow direction={isMobile ? "column" : "row"} align="start">
                <Stack sx={() => ({ flexGrow: 2 })} align="center">
                    <Text underline>Manuell</Text>
                    <Text>Kopieren Sie diesen Text ins "Importieren" Menü auf dem Zielgerät</Text>
                    <Textarea autosize sx={{ width: "100%" }}>
                        {key}
                    </Textarea>
                    {copied ? (
                        <ThemeIcon color="green" size="xl">
                            <Check />
                        </ThemeIcon>
                    ) : (
                        <Button
                            leftIcon={<Copy />}
                            onClick={() => {
                                clipboard.copy(key);
                                setCopied(true);
                                window.setTimeout(() => setCopied(false), 1000);
                            }}
                        >
                            Kopieren
                        </Button>
                    )}
                </Stack>
                {allowQrCode && (
                    <Stack sx={() => ({ flexGrow: 2 })} align="center">
                        <Text underline>Per QR-Code</Text>
                        <QRCode content={key!} />
                    </Stack>
                )}
            </Group>
        </Stack>
    );
};
