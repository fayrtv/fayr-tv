import {
    Button,
    Center,
    Overlay,
    Paper,
    Text,
    TextInput,
    useMantineColorScheme,
} from "@mantine/core";
import React, { PropsWithChildren, useEffect, useState } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useForm } from "@mantine/hooks";
import { Auth, withSSRContext } from "aws-amplify";
import { GetServerSideProps } from "next";
import { User } from "~/models/user";
import Router from "next/router";

type Props = {
    user: User;
};

const Confirm: NextPageWithLayout<Props> = ({ user }) => {
    const { colorScheme } = useMantineColorScheme();

    const form = useForm({
        initialValues: {
            code: "",
        },
    });

    console.log(user);

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
                width: "100%",
            }}
        >
            {colorScheme === "dark" && <Overlay opacity={0.6} color="black" zIndex={1} blur={2} />}
            <Paper sx={{ zIndex: 1, position: "relative" }} px="xl" py="lg">
                <Center>
                    <ZeissLogo />
                </Center>
                <Text transform="uppercase" color="primary" weight="bold" size="lg" mt={60}>
                    E-Mail Adresse bestätigen
                </Text>
                {user && (
                    <>
                        Wir haben Ihnen eine E-Mail an TODO geschickt. Bitte code eingeben
                        <form
                            onSubmit={form.onSubmit(async (values) => {
                                await Auth.confirmSignUp(user.email, values.code);
                            })}
                        >
                            <TextInput required label="Code" {...form.getInputProps("code")} />
                            <Button type="submit">Bestätigen</Button>
                        </form>
                    </>
                )}
            </Paper>
        </Center>
    );
};

Confirm.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const SSR = withSSRContext({ req });

    const userInfo = await SSR.Auth.currentUserInfo();
    const attributes = userInfo.attributes;

    const alreadyVerified = attributes.email_verified;
    if (alreadyVerified) {
        // Already verified
        res.writeHead(301, { Location: "/" });
        res.end();
        return { props: {} };
    }

    const user: User = {
        email: attributes.email,
        emailVerified: attributes.email_verified,
        address: attributes.address ?? null,
        title: attributes.title ?? null,
        firstName: attributes.first_name ?? null,
        lastName: attributes.family_name ?? null,
    };

    return {
        props: {
            user,
        },
    };
};

export default Confirm;
