import { useStoreInfo } from "~/components/StoreInfoProvider";
import useEncryption from "~/hooks/useEncryption";
import { NextPageWithLayout } from "~/types/next-types";
import { Button, Stack } from "@mantine/core";
import Layout from "~/components/layout/Layout";

const Debug: NextPageWithLayout = () => {
    const storeInfo = useStoreInfo();

    const encryption = useEncryption();

    return (
        <Stack>
            <Button onClick={() => encryption.createStoreKeyPair(storeInfo.id)}>
                createStoreKeyPair
            </Button>
            <Button
                onClick={() =>
                    encryption.setupDeviceSecretIfNotExists(
                        "b32cb828-6ba4-4421-8099-7e5b6ec1a45b",
                        storeInfo.id,
                    )
                }
            >
                setupDeviceSecretIfNotExists
            </Button>
        </Stack>
    );
};

Debug.layoutProps = {
    Layout: Layout,
};

export default Debug;
