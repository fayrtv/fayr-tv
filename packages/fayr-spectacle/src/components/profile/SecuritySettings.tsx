import { Button, Divider, Group, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import * as React from "react";
import { AlertTriangle, ArrowBarDown, ArrowBarUp, Rotate } from "tabler-icons-react";
import { User } from "~/types/user";
import useEncryption from "~/hooks/useEncryption";
import { useStoreInfo } from "../StoreInfoProvider";
import { useSession } from "../../hooks/useSession";
import { useRouter } from "next/router";
import { ExportMenu } from "./security/ExportMenu";
import { ImportMenu } from "./security/ImportMenu";
import { GenerateSecret, GenerateStorePair } from "./security/GenerateMenu";

type Props = {
    user: User;
};

type ModalOperation =
    | "ImportSecret"
    | "ExportSecret"
    | "GenerateStorePair"
    | "ImportStoreKey"
    | "ExportStoreKey"
    | "GenerateSecret"
    | "SecretMismatch";

const SecretMismatch = () => {
    const router = useRouter();
    return (
        <Stack>
            <Group direction="row" noWrap>
                <ThemeIcon color="yellow" size="xl">
                    <AlertTriangle />
                </ThemeIcon>
                <span>
                    Leider scheint ihr lokales Verschlüsselungsgeheimnis noch nicht / nicht korrekt
                    eingerichtet zu sein. Sie können entweder das Geheimnis erneut generieren, oder
                    von einem anderen Gerät importieren.
                </span>
            </Group>
            <Group direction="row" position="apart" noWrap>
                <Button
                    leftIcon={<Rotate />}
                    onClick={() => router.push("/profile/security/GenerateSecret")}
                >
                    Neu Generieren
                </Button>
                <Button
                    leftIcon={<ArrowBarDown />}
                    onClick={() => router.push("/profile/security/ImportSecret")}
                >
                    Importieren
                </Button>
            </Group>
        </Stack>
    );
};

export const SecuritySettings = ({ user }: Props) => {
    const { isAdmin } = useSession();

    const [canExportSecret, setCanExportSecret] = React.useState(false);
    const [canExportStorePrivateKey, setCanExportStorePrivateKey] = React.useState(false);

    const router = useRouter();
    const route: ModalOperation | undefined =
        router.query.slug?.length !== 2
            ? undefined
            : (router.query.slug![1] as ModalOperation | undefined);

    const { encryptionManager, localEncryptionManager } = useEncryption();

    const pushRoute = (routeSuffix?: ModalOperation) => {
        router.push(`/profile/security${routeSuffix !== undefined ? `/${routeSuffix}` : ""}`);
    };

    const storeInfo = useStoreInfo();
    const closeModal = React.useCallback(pushRoute, [router]);

    const modalContent = React.useMemo(() => {
        let content: React.ReactNode | null = null;

        switch (true) {
            case route?.includes("ExportSecret"):
                content = (
                    <ExportMenu
                        keyRetriever={async () =>
                            (await localEncryptionManager.getSecret(user.id, storeInfo.id))!
                        }
                    />
                );
                break;
            case route?.includes("ImportSecret"):
                content = (
                    <ImportMenu
                        closeModal={closeModal}
                        keyAvailabilityChecker={async () =>
                            await localEncryptionManager.hasSecret(user.id, storeInfo.id)
                        }
                        keySetter={async (keyAsJson: any) => {
                            const importedKey = await window.crypto.subtle.importKey(
                                "jwk",
                                keyAsJson,
                                "AES-GCM",
                                true,
                                ["encrypt", "decrypt"],
                            );
                            await localEncryptionManager.setSecret(
                                importedKey,
                                user.id,
                                storeInfo.id,
                            );
                        }}
                    />
                );
                break;
            case route?.includes("GenerateStorePair"):
                content = (
                    <GenerateStorePair
                        encryptionManager={encryptionManager}
                        localEncryptionStorageHandler={localEncryptionManager}
                        store={storeInfo}
                        closeModal={closeModal}
                    />
                );
                break;
            case route?.includes("ImportStoreKey"):
                content = (
                    <ImportMenu
                        closeModal={closeModal}
                        keyAvailabilityChecker={async () =>
                            await localEncryptionManager.hasStorePrivateKey(storeInfo.id)
                        }
                        keySetter={async (keyAsJson: any) => {
                            const importedKey = await window.crypto.subtle.importKey(
                                "jwk",
                                keyAsJson,
                                { name: "RSA-OAEP", hash: { name: "SHA-256" } },
                                true,
                                ["decrypt"],
                            );
                            await localEncryptionManager.setStorePrivateKey(
                                importedKey,
                                storeInfo.id,
                            );
                        }}
                    />
                );
                break;
            case route?.includes("ExportStoreKey"):
                content = (
                    <ExportMenu
                        allowQrCode={false}
                        keyRetriever={async () =>
                            (await localEncryptionManager.getStorePrivateKey(storeInfo.id))!
                        }
                    />
                );
                break;
            case route?.includes("GenerateSecret"):
                content = (
                    <GenerateSecret
                        encryptionManager={encryptionManager}
                        user={user}
                        localEncryptionStorageHandler={localEncryptionManager}
                        store={storeInfo}
                        closeModal={closeModal}
                    />
                );
                break;
            case route?.includes("SecretMismatch"):
                content = <SecretMismatch />;
        }

        return content;
    }, [closeModal, encryptionManager, localEncryptionManager, route, storeInfo, user]);

    React.useEffect(() => {
        const init = async () => {
            const storeId = storeInfo.id;
            const [hasSecret, hasStorePrivateKey] = await Promise.all([
                localEncryptionManager.hasSecret(user.id, storeInfo.id),
                localEncryptionManager.hasStorePrivateKey(storeId),
            ]);

            setCanExportSecret(hasSecret);
            setCanExportStorePrivateKey(hasStorePrivateKey);
        };

        init();
    }, [localEncryptionManager, storeInfo.id, user.id]);

    return (
        <Stack>
            <Text>Verwalten sie hier ihre persönlichen Sicherheitseinstellungen.</Text>
            <Group direction="row">
                <Text weight={600}>Verschlüsselungsinfo für ihren Brillenpass:</Text>
                <Button
                    leftIcon={<ArrowBarUp />}
                    onClick={() => pushRoute("ExportSecret")}
                    disabled={!canExportSecret}
                >
                    Exportieren
                </Button>
                <Button leftIcon={<ArrowBarDown />} onClick={() => pushRoute("ImportSecret")}>
                    Importieren
                </Button>
            </Group>
            {isAdmin && (
                <>
                    <Divider orientation="horizontal" />
                    <Text>
                        Verwalten sie hier ihre Sicherheitseinstellungen für ihr ZEISS VISION
                        CENTER.
                    </Text>
                    <Group direction="row">
                        <Text weight={600}>Verschlüsselungsinfo für ihr ZEISS VISION CENTER:</Text>
                        <Button
                            leftIcon={<Rotate />}
                            onClick={() => pushRoute("GenerateStorePair")}
                        >
                            Generieren
                        </Button>
                        <Button
                            leftIcon={<ArrowBarUp />}
                            onClick={() => pushRoute("ExportStoreKey")}
                            disabled={!canExportStorePrivateKey}
                        >
                            Exportieren
                        </Button>
                        <Button
                            leftIcon={<ArrowBarDown />}
                            onClick={() => pushRoute("ImportStoreKey")}
                        >
                            Importieren
                        </Button>
                    </Group>
                </>
            )}
            <Modal
                size="xl"
                centered
                opened={route !== undefined}
                onClose={() => closeModal()}
                title={
                    route === "GenerateStorePair"
                        ? "Generieren"
                        : route === "ExportStoreKey" || route === "ExportSecret"
                        ? "Exportieren"
                        : "Importieren"
                }
            >
                {modalContent}
            </Modal>
        </Stack>
    );
};

export default SecuritySettings;
