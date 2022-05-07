import { useMantineColorScheme } from "@mantine/core";
import { GetServerSideProps } from "next";
import React from "react";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

const Welcome: NextPageWithLayout = () => {
    const { colorScheme } = useMantineColorScheme();

    return <>Welcome</>;
};

Welcome.layoutProps = {
    Layout,
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {},
    };
};

export default Welcome;
