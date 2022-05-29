import { useStoreInfo } from "~/components/StoreInfoProvider";
import useEncryption from "~/hooks/useEncryption";
import { NextPageWithLayout } from "~/types/next-types";
import { Button, Container, Stack, Text, TextInput } from "@mantine/core";
import Layout from "~/components/layout/Layout";
import { useForm } from "@mantine/form";
import { DataStore } from "aws-amplify";
import { Customer } from "~/models";
import ContentBody from "~/components/layout/ContentBody";
import { LinkExistingCustomerRequest } from "~/pages/api/customers/link-existing";

const LinkExistingCustomerPage: NextPageWithLayout = () => {
    const storeInfo = useStoreInfo();

    const form = useForm({
        initialValues: {
            userEmail: "",
        },
    });

    return (
        <ContentBody>
            <Stack>
                <Text size="xl" color="primary" weight="bold">
                    Bestehenden Nutzer als Kunden hinzufügen
                </Text>
                <form
                    onSubmit={form.onSubmit(async ({ userEmail }) => {
                        const payload: LinkExistingCustomerRequest = { userEmail };
                        const response = await fetch("/api/customers/link-existing", {
                            body: JSON.stringify(payload),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        console.log(response);
                    })}
                >
                    <Stack spacing="sm">
                        <TextInput
                            {...form.getInputProps("userEmail")}
                            label="E-Mail Adresse des Nutzers"
                        />
                        <Button type="submit">Verlinken</Button>
                    </Stack>
                </form>
            </Stack>
        </ContentBody>
    );
};

LinkExistingCustomerPage.layoutProps = {
    Layout: Layout,
};

export default LinkExistingCustomerPage;
