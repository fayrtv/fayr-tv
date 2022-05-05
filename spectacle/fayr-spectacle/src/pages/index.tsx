import { Anchor, Box, Center, Container, Stack } from "@mantine/core";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";

const Home: NextPageWithLayout = () => {
    return (
        <Box mx="auto" px="md">
            <h2>Sitemap</h2>
            <ul>
                <li>
                    <Anchor href={"/content/spectaclepass"}>Brillenpass</Anchor>
                </li>
                <li>
                    <Anchor href={"/auth/signup"}>Registrieren</Anchor>
                </li>
                <li>
                    <Anchor href={"/auth/signin"}>Einloggen</Anchor>
                </li>
                <li>
                    <Anchor href={"/auth/recover"}>Passwort vergessen</Anchor>
                </li>
                <li>
                    <Anchor href={"/about/digital-spectacle-passport"}>
                        Infos zum Brillenpass
                    </Anchor>
                </li>
            </ul>
        </Box>
    );
};

Home.layoutProps = {
    Layout: Layout,
};

export default Home;
