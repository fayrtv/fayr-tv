import { Anchor, Center, Overlay, Paper, Text, useMantineColorScheme } from "@mantine/core";
import React from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Layout from "~/components/layout";
import { NextPageWithLayout } from "~/types/next-types";
import { User } from "~/models/user";

type Props = {
    user: User | null;
};

const Confirm: NextPageWithLayout<Props> = ({ user }) => {
    const { colorScheme } = useMantineColorScheme();

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
                Wir haben Ihnen eine E-Mail an TODO geschickt.{" "}
                <Anchor href="/auth/signin">Zum Login</Anchor>
            </Paper>
        </Center>
    );
};

Confirm.layoutProps = {
    Layout,
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const SSR = withSSRContext({ req });
//
//     const userInfo = await SSR.Auth.currentUserInfo();
//
//     const attributes = userInfo?.attributes;
//
//     if (!attributes) {
//         return {
//             props: {
//                 user: null,
//             },
//         };
//     }
//
//     const alreadyVerified = attributes.email_verified;
//     if (alreadyVerified) {
//         // Already verified
//         res.writeHead(301, { Location: "/" });
//         res.end();
//         return { props: {} };
//     }
//
//     const user: User = {
//         email: attributes.email,
//         emailVerified: attributes.email_verified,
//         address: attributes.address ?? null,
//         title: attributes.title ?? null,
//         firstName: attributes.first_name ?? null,
//         lastName: attributes.family_name ?? null,
//     };
//
//     return {
//         props: {
//             user,
//         },
//     };
// };

export default Confirm;
