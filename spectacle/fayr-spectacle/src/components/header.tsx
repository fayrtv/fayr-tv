import { Anchor, Box, Burger, Container, Group, Sx, Text } from "@mantine/core";
import React from "react";
import ThemeToggleButton from "~/components/theme-toggle-button";

const Header = () => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);

    const city = "Osnabrück";

    const shopOwner = "Reiner Siekemeyer";
    const shopOwnerHeadline = `Inhaber: ${shopOwner}`;

    return (
        <Box
            component="header"
            py="md"
            sx={{
                textAlign: "center",
                borderBottom: "1px solid lightgray",
                backgroundColor: "#000000",
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
                        ZEISS VISION CENTER {city} | {shopOwnerHeadline}
                    </Anchor>
                    <Group direction="row" position="apart" style={{ width: "100%" }} mt="xs">
                        <Text color="primary" size="xl" weight="bold">
                            Digitaler Brillenpass
                        </Text>
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
