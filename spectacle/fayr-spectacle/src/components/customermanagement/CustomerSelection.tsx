// Framework
import { Stack, Text, Autocomplete, Paper, Grid, Divider, Badge, Button } from "@mantine/core";
import * as React from "react";
import { Customer } from "~/types/user";

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
            <Grid.Col span={1}>
                <Text>{customer.lastName}</Text>
            </Grid.Col>
            <Grid.Col span={1}>
                <Text>{customer.firstName}</Text>
            </Grid.Col>
            <Grid.Col span={1}>
                <Badge size="md" color="transparent" radius="xs">
                    <Text>{customer.emailVerified ? "Aktiv" : "Inaktiv"}</Text>
                </Badge>
            </Grid.Col>
            <Grid.Col span={1}>
                <Text>{customer.email}</Text>
            </Grid.Col>
            <Grid.Col span={1}>
                <Button onClick={pickCustomer}>Auswählen</Button>
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
                <Grid columns={5}>
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
