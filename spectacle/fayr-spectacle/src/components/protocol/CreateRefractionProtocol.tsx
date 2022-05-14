import { NextPageWithLayout } from "../../types/next-types";
import Layout from "../layout/Layout";
import { Container, Grid, Table, Text, Badge } from "@mantine/core";
import { Customer } from "../../types/user";

type Props = {
    customer: Customer;
};

const CreateRefractionProtocol: NextPageWithLayout<Props> = ({ customer }: Props) => {
    return (
        <Container>
            <Grid columns={6}>
                <Grid.Col span={3}>
                    <Text>Refraktionsprotokoll anlegen</Text>
                </Grid.Col>
                <Grid.Col span={1} offset={2}>
                    <Text>Neues Kundenkonto</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Table horizontalSpacing="xl" sx={(_) => ({ border: "1px solid black" })}>
                        <thead>
                            <tr>
                                <th>Nachname</th>
                                <th>Vorname</th>
                                <th>Status</th>
                                <th>E-Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={customer.email}>
                                <td>{customer.lastName}</td>
                                <td>{customer.firstName}</td>
                                <td>
                                    <Badge size="md" color="transparent" radius="xs">
                                        <Text>{customer.emailVerified ? "Aktiv" : "Inaktiv"}</Text>
                                    </Badge>
                                </td>
                                <td>{customer.email}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

CreateRefractionProtocol.layoutProps = {
    Layout: Layout,
};

export default CreateRefractionProtocol;
