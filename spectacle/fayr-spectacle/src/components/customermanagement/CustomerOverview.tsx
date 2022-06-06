import { Button, Group, MediaQuery, Popover, Stack, Table, Text } from "@mantine/core";
import { Customer } from "~/types/user";
import React, { useCallback } from "react";
import { CustomerStatusBadge } from "~/components/customermanagement/CustomerStatusBadge";
import { useBooleanToggle } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { useRouter } from "next/router";

type Props = {
    customer: Customer;
};

const CustomerOverview = ({ customer }: Props) => {
    const { push } = useRouter();
    const storeInfo = useStoreInfo();
    const [confirmDeletionOpen, setConfirmDeletionOpen] = useBooleanToggle(false);

    const removeCustomer = useCallback(async () => {
        const response = await fetch(`/api/customers/remove?id=${customer.customerID}`, {
            credentials: "include",
            method: "DELETE",
        });
        if (response.ok) {
            await push("/customermanagement");
        }
    }, [customer.customerID, push]);

    return (
        <Stack>
            <MediaQuery styles={{ display: "none" }} largerThan="sm">
                <Stack spacing="sm">
                    <Text>
                        {customer.lastName}, {customer.firstName}
                    </Text>
                    <Text>{customer.email}</Text>
                    <CustomerStatusBadge customer={customer} />
                </Stack>
            </MediaQuery>
            {/* Would be nice if mantine had a `smallerThanOrEqual` property on the media query component here */}
            <MediaQuery styles={{ display: "none" }} smallerThan="sm">
                <Table sx={{ minWidth: 600 }}>
                    <thead>
                        <tr>
                            <th>Nachname, Vorname</th>
                            <th>Status</th>
                            <th>E-Mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={customer.email}>
                            <td>
                                {customer.lastName}, {customer.firstName}
                            </td>
                            <td>
                                <CustomerStatusBadge customer={customer} />
                            </td>
                            <td>{customer.email}</td>
                        </tr>
                    </tbody>
                </Table>
            </MediaQuery>

            <Group>
                <Popover
                    opened={confirmDeletionOpen}
                    onClose={() => setConfirmDeletionOpen(false)}
                    target={
                        <Button
                            color="danger"
                            size="xs"
                            onClick={() => setConfirmDeletionOpen(true)}
                        >
                            Als Kunden entfernen
                        </Button>
                    }
                    position="right"
                    withArrow
                >
                    <Stack>
                        <Text size="sm" sx={{ maxWidth: 300 }}>
                            <b>Sind Sie sicher?</b>
                            <br />
                            Der Nutzer wird seinen Account weiterhin verwenden können und Zugriff
                            auf seine Refraktionsprotokolle haben, aber kein Kunde von{" "}
                            {storeInfo.name} {storeInfo.city} mehr sein.
                        </Text>
                        <Group>
                            <Button color="gray" onClick={() => setConfirmDeletionOpen(false)}>
                                Abbrechen
                            </Button>
                            <Button color="danger" onClick={removeCustomer}>
                                Ja, Kunden entfernen
                            </Button>
                        </Group>
                    </Stack>
                </Popover>
            </Group>
        </Stack>
    );
};

export default CustomerOverview;
