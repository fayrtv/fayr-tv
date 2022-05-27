import { useStoreInfo } from "~/components/StoreInfoProvider";
import useEncryption from "~/hooks/useEncryption";
import { NextPageWithLayout } from "~/types/next-types";
import { Button } from "@mantine/core";
import Layout from "~/components/layout/Layout";

const Debug: NextPageWithLayout = () => {
    const storeInfo = useStoreInfo();

    const encryption = useEncryption();

    const onClick = async () => {
        await encryption.createStoreKeyPair(storeInfo.id);
        await encryption.setupDeviceSecretIfNotExists(storeInfo.id);
    };

    return <Button onClick={onClick}>Debug encryption</Button>;
};

Debug.layoutProps = {
    Layout: Layout,
};

export default Debug;
