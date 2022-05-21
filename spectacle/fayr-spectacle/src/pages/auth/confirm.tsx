import { Button, Center, Container, Overlay, Paper, Text } from "~/components/common";
import React from "react";
import ZeissLogo from "~/components/ZeissLogo";
import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import { useMantineColorScheme } from "@mantine/core";

const ConfirmPage: NextPageWithLayout = () => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                height: "100%",
                width: "100%",
            }}
        >
            <Container size="sm">
                {colorScheme === "dark" && (
                    <Overlay opacity={0.6} color="black" zIndex={1} blur={2} />
                )}
                <Paper sx={{ zIndex: 1, position: "relative" }} px="xl" py="lg">
                    <Center>
                        <ZeissLogo />
                    </Center>
                    <Text transform="uppercase" color="primary" weight="bold" size="lg" mt={60}>
                        E-Mail bestätigen
                    </Text>
                    <Text mt="xs" size="sm">
                        Wir haben Ihnen eine E-Mail geschickt. Bitte klicken Sie auf den Link, um
                        Ihre Registrierung abzuschließen.{" "}
                    </Text>
                    <br />
                    <Button component="a" href="/auth/signin">
                        Zum Login
                    </Button>
                </Paper>
            </Container>
        </Center>
    );
};

ConfirmPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default ConfirmPage;
