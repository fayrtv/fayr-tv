import { Box, Container, Text, Group, Sx, Burger } from "@mantine/core";
import Link from "next/link";
import React from "react";

const defaultTextProps: Sx = { fontSize: "1em", fontWeight: 600 };

const Header = () => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);

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
            <Container>
                <Group spacing="xs">
                    <Text color="white" sx={defaultTextProps}>
                        <Link href="/">ZEISS VISION CENTER Osnabrück</Link>
                    </Text>
                    <Group direction="row" position="apart" style={{ width: "100%" }}>
                        <Text color="#4498D8" sx={defaultTextProps}>
                            Digitaler Brillenpass
                        </Text>
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
