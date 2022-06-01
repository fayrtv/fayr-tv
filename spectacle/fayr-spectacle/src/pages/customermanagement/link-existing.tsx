import { useStoreInfo } from "~/components/StoreInfoProvider";
import useEncryption from "~/hooks/useEncryption";
import { NextPageWithLayout } from "~/types/next-types";
import { Button, Container, Stack, Text, TextInput } from "@mantine/core";
import Layout from "~/components/layout/Layout";
import { useForm } from "@mantine/form";
import { DataStore } from "aws-amplify";
import { Customer } from "~/models";
import MainContainer from "~/components/layout/MainContainer";
import { LinkExistingCustomerRequest } from "~/pages/api/customers/link-existing";
import { useState } from "react";
import { useError } from "~/hooks/useError";
import { useRouter } from "next/router";

const LinkExistingCustomerPage: NextPageWithLayout = () => {
    const { push } = useRouter();
    const { setError, renderError } = useError({
        title: "Konnte diesen Nutzer nicht hinzufügen.",
    });
    const form = useForm({
        initialValues: {
            userEmail: "",
        },
    });

    return (
        <MainContainer
            crumbs={[
                { title: "Kundenverwaltung", href: "/customermanagement" },
                { title: "Konto verknüpfen" },
            ]}
        >
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
                        await push("/customermanagement");
                    })}
                >
                    <Stack spacing="sm" align="flex-start">
                        <TextInput
                            {...form.getInputProps("userEmail")}
                            label="E-Mail Adresse des Nutzers"
                            sx={{ minWidth: 300 }}
                        />
                        <Button type="submit">Verlinken</Button>
                    </Stack>
                </form>
            </Stack>
        </MainContainer>
    );
};

LinkExistingCustomerPage.layoutProps = {
    Layout: Layout,
};

export default LinkExistingCustomerPage;
