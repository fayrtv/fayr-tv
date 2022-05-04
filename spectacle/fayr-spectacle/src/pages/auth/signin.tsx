import { BackgroundImage, Center, Container, Image } from "@mantine/core";
import { Sign } from "crypto";
import { GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";
import { ClientSafeProvider } from "next-auth/react/types";
import React, { useState } from "react";
import MainLayout from "~/components/MainLayout";
import { NextPageWithLayout } from "~/types/next-types";

type ServerProps = {
    providers: ClientSafeProvider[];
};

type Props = ServerProps;

const SignIn: NextPageWithLayout<Props> = ({ providers }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
            }}
        >
            <Container
                sx={(theme) => ({
                    backgroundColor: theme.colors.primaryColorName,
                })}
                size={"lg"}
            >
                <Image src={"/assets/zeiss_logo.svg"} />
            </Container>
        </Center>
    );
};

SignIn.layoutProps = {
    Layout: MainLayout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};

export default SignIn;
