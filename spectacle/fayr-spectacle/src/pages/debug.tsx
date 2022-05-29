import { useStoreInfo } from "~/components/StoreInfoProvider";
import useEncryption from "~/hooks/useEncryption";
import { NextPageWithLayout } from "~/types/next-types";
import { Button, Stack } from "@mantine/core";
import Layout from "~/components/layout/Layout";
import { useSession } from "../hooks/useSession";

const Debug: NextPageWithLayout = () => {
    const storeInfo = useStoreInfo();

    const { customer } = useSession();

    const encryption = useEncryption();

    return (
        <Stack>
            <Button onClick={() => encryption.createStoreKeyPair(storeInfo.id)}>
                createStoreKeyPair
            </Button>
            <Button
                onClick={() =>
                    encryption.setupDeviceSecretIfNotExists(
                        "ce77a060-73b4-40e9-a2da-d43214ea0133",
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
