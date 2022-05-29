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
import { useState } from "react";
import { useError } from "~/hooks/useError";
import { useRouter } from "next/router";

const LinkExistingCustomerPage: NextPageWithLayout = () => {
    const { push } = useRouter();
    const { error, setError, renderError } = useError({
        title: "Konnte diesen Nutzer nicht hinzufügen.",
    });
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
                {renderError()}
                <form
                    onSubmit={form.onSubmit(async ({ userEmail }) => {
                        setError(null);
                        const payload: LinkExistingCustomerRequest = { userEmail };
                        const response = await fetch("/api/customers/link-existing", {
                            body: JSON.stringify(payload),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        if (!response.ok) {
                            setError(
                                response.status === 409
                                    ? "Dieser Nutzer ist bereits ein Kunde Ihrer Filiale."
                                    : response.status === 404
                                    ? "Es existiert kein Nutzer mit dieser E-Mail Adresse."
                                    : response.statusText,
                            );
                            return;
                        }
                        await push("../");
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
