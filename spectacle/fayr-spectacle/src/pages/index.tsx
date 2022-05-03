import { List, Text, Title, Anchor } from "@mantine/core";
import { NextPageWithLayout } from "~/types/next-types";

import MainLayout from "../components/MainLayout";
import Layout from "../components/layout";
import Link from "next/link";

const Home: NextPageWithLayout = () => {
    return (
        <Layout>
            <>
                <Link href={"/content/spectaclepass"}>SpectaclePass</Link>
            </>
        </Layout>
    );
};

Home.layoutProps = {
    Layout: MainLayout,
};

export default Home;
