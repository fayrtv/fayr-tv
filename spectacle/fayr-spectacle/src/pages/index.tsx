import Layout from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { Box, Anchor } from "~/components/common";

const SitemapPage: NextPageWithLayout = () => {
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
                <li>
                    <Anchor href={"/content/fittingroom"}>Anprobe</Anchor>
                </li>
                <li>
                    <Anchor href={"/appointment"}>Terminvereinbarung</Anchor>
                </li>
            </ul>
        </Box>
    );
};

SitemapPage.layoutProps = {
    Layout: Layout,
};

export default SitemapPage;
