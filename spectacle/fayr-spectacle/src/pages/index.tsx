import Link from "next/link";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

const Home: NextPageWithLayout = () => {
    return (
        <>
            <Link href={"/content/spectaclepass"}>hallo welt</Link>
        </>
    );
};

Home.layoutProps = {
    Layout: Layout,
};

export default Home;
