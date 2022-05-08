import { Anchor, Box, Burger, Container, Group, Text } from "~/components/common";
import React from "react";
import ThemeToggleButton from "~/components/theme-toggle-button";
import { useMediaQuery } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";

const Header = () => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);

    const storeInfo = useStoreInfo();

    const shouldDisplayStoreOwnerHeadline = useMediaQuery("(min-width: 500px)", false);

    return (
        <Box
            component="header"
            py="md"
            sx={{
                textAlign: "center",
                borderBottom: "1px solid lightgray",
                backgroundColor: "#000000",
                zIndex: 3,
            }}
        >
            <Container fluid>
                <Group direction="column" spacing="xs">
                    <Anchor
                        href="/"
                        sx={(theme) => ({
                            color: theme.white,
                            ":hover": { textDecoration: "none" },
                        })}
                        size="sm"
                    >
                        <Text transform="uppercase">{}</Text> {storeInfo.city}
                        {shouldDisplayStoreOwnerHeadline && <> | Inhaber: {storeInfo.owner}</>}
                    </Anchor>
                    <Group direction="row" position="apart" style={{ width: "100%" }} mt="xs">
                        <Anchor href="/">
                            <Text color="primary" size="xl" weight="bold">
                                Digitaler Brillenpass
                            </Text>
                        </Anchor>
                        <ThemeToggleButton />
                        <Burger
                            color="white"
                            opened={burgerOpen}
                            onClick={() => setBurgerOpen((curr) => !curr)}
                        />
                    </Group>
                </Group>
            </Container>
        </Box>
    );
};

export default Header;
