import {
    Anchor,
    BackgroundImage,
    Button,
    Center,
    Container,
    Group,
    Image,
    PasswordInput,
    Text,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Sign } from "crypto";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { useState } from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

const SignIn: NextPageWithLayout<Props> = ({ providers }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            termsOfService: false,
        },
    });

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
                width: "100%",
            }}
        >
            <Container sx={(theme) => ({ backgroundColor: theme.white })} size={"lg"} p="lg">
                <Center>
                    <Image src={"/assets/zeiss_logo.svg"} alt="ZEISS Logo" width={80} />
                </Center>
                <Text transform="uppercase" color="primary" weight="bold" size="md" mt="lg">
                    Anmeldung
                </Text>
                <Text color="black" size="lg" weight="bold" mt="md">
                    Willkommen bei Ihrem
                    <br />
                    ZEISS VISION CENTER Osnabrück
                </Text>
                <TextInput required label="Email" {...form.getInputProps("email")} mt="md" />
                <PasswordInput required label="Password" {...form.getInputProps("password")} />

                <Group position="center" mt="lg">
                    <Button type="submit" styles={{ inner: { fontWeight: "lighter" } }}>
                        Anmelden
                    </Button>
                </Group>

                <Text color="black" size="sm" mt="sm">
                    Noch nicht registriert?{" "}
                    <Anchor href="signup">Legen Sie hier Ihren Digitalen Brillenpass an.</Anchor>
                </Text>
            </Container>
        </Center>
    );
};

SignIn.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignIn;
