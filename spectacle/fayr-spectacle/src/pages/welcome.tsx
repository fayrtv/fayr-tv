import { useMantineColorScheme } from "@mantine/core";
import { GetServerSideProps } from "next";
import React from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { formatUserAddress, User } from "~/models/user";
import { getUser } from "~/helpers/authentication";

type Props = {
    user: User;
};

const Welcome: NextPageWithLayout<Props> = ({ user }) => {
    const { colorScheme } = useMantineColorScheme();

    return <>Willkommen {formatUserAddress(user)}</>;
};

Welcome.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    return {
        props: {
            user: await getUser(req),
        },
    };
};

export default Welcome;
