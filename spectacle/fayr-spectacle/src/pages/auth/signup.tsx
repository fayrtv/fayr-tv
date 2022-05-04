import {Anchor, Button, Group, PasswordInput} from "@mantine/core";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { useState } from "react";
import {useForm} from "@mantine/hooks";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

export default function SignUp({ providers }: Props) {
    const isValid = false;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [receiveUpdates, setReceiveUpdates] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },

        validate: {
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match' : null,
        },
    });

    return <>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <PasswordInput
                label="Password"
                placeholder="Password"
                {...form.getInputProps('password')}
            />

            <PasswordInput
                mt="sm"
                label="Confirm password"
                placeholder="Confirm password"
                {...form.getInputProps('confirmPassword')}
            />

            <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    </div>;
}

const validateEmail = (email: string) =>
    String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
