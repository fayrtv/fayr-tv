import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import * as React from "react";
import { ArrowBarUp } from "tabler-icons-react";
import { Customer } from "~/types/user";
import { ExportMenu } from "../profile/security/ExportMenu";
import useEncryption from "../../hooks/useEncryption";
import { useStoreInfo } from "../StoreInfoProvider";

type Props = {
    customer: Customer;
};

export const ExportCustomerSecret = ({ customer: { id: customerId } }: Props) => {
    const [showMenu, setShowMenu] = React.useState(false);

    const { encryptionManager } = useEncryption();

    const { id: storeId } = useStoreInfo();

    return (
        <Stack>
            <Modal
                size="xl"
                centered
                opened={showMenu}
                onClose={() => setShowMenu(false)}
                title={"Verschlüsselungsgeheimnis exportieren"}
            >
                <ExportMenu
                    keyRetriever={async () =>
                        (await encryptionManager.getCustomerSecret(customerId, storeId))!
                    }
                />
            </Modal>
            <Text>
                Sollte ihr Kunde sein Verschlüsselungsgeheimnis verloren haben, so können sie hier
                sein Geheimnis auslesen und ihm erneut zum Import übermitteln.
            </Text>
            <Group position="center">
                <Button leftIcon={<ArrowBarUp />} onClick={() => setShowMenu(true)}>
                    Exportieren
                </Button>
            </Group>
        </Stack>
    );
};
