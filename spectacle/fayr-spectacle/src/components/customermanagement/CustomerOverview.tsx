import { Badge, Container, Group, Table, Text } from "@mantine/core";
import { Customer } from "../../types/user";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { CustomerStatusBadge } from "~/components/customermanagement/CustomerStatusBadge";

type Props = {
    customer: Customer;
};

const CustomerOverview = ({ customer }: Props) => {
    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);
    return isMobile ? (
        <Group direction="row" grow spacing="xl">
            <Group direction="column">
                <Text>
                    {customer.lastName}, {customer.firstName}
                </Text>
                <Text>{customer.email}</Text>
            </Group>
            <CustomerStatusBadge customer={customer} />
        </Group>
    ) : (
        <Table>
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
    );
};

export default CustomerOverview;
