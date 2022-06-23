// Framework
import { Autocomplete, Button, Divider, Grid, Paper, Stack, Text } from "@mantine/core";
import * as React from "react";
import { Customer } from "~/types/user";
import { CustomerStatusBadge } from "~/components/customermanagement/CustomerStatusBadge";

type Props = {
    customers: Array<Customer>;
    setCustomerSelection: (customer: Customer) => void;
};

const CustomerRow = ({
    customer,
    pickCustomer,
}: {
    customer: Customer;
    pickCustomer: () => void;
}) => {
    return (
        <>
            <Grid.Col span={1}>{customer.lastName}</Grid.Col>
            <Grid.Col span={1}>{customer.firstName}</Grid.Col>
            <Grid.Col span={1}>
                <CustomerStatusBadge customer={customer} />
            </Grid.Col>
            <Grid.Col span={1}>{customer.email}</Grid.Col>
            <Grid.Col span={1} sx={{ textAlign: "right" }}>
                <Button onClick={pickCustomer} size="sm" compact>
                    Auswählen
                </Button>
            </Grid.Col>
        </>
    );
};

export const CustomerSelection = ({ customers = [], setCustomerSelection }: Props) => {
    const [query, setQuery] = React.useState("");

    const filteredCustomers = React.useMemo(
        () => customers.filter((x) => x.email.startsWith(query)),
        [customers, query],
    );

    return (
        <Paper sx={(_) => ({ width: "100%" })}>
            <Stack align="stretch" justify="flex-start">
                <Text color="primary" size="xl" weight="bold">
                    Nutzer auswählen
                </Text>
                <Autocomplete
                    value={query}
                    onChange={setQuery}
                    data={customers.map((x) => x.email)}
                    placeholder="Suche eingeben"
                />
                <Grid columns={5}>
                    <Grid.Col span={1}>
                        <Text>Nachname</Text>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Text>Vorname</Text>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Text>Status</Text>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Text>E-Mail</Text>
                    </Grid.Col>
                </Grid>
                <Divider my="sm" />
                <Grid columns={5} align="center">
                    {filteredCustomers.map((x) => (
                        <CustomerRow
                            customer={x}
                            key={x.email}
                            pickCustomer={() => setCustomerSelection(x)}
                        />
                    ))}
                </Grid>
            </Stack>
        </Paper>
    );
};

export default CustomerSelection;