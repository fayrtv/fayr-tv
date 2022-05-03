import { Box, Container, Text, Group } from "@mantine/core";
import Link from "next/link";

import ThemeToggleButton from "../components/theme-toggle-button";

const Header = () => (
    <Box
        component="header"
        py="md"
        sx={{ textAlign: "center", borderBottom: "1px solid lightgray" }}
    >
        <Container>
            <Group>
                <Text
                    variant="gradient"
                    gradient={{ from: "primary", to: "secondary", deg: 45 }}
                    sx={{ fontSize: "1.5em", fontWeight: 800 }}
                >
                    <Link href="/">ZEISS VISION CENTER Osnabrück</Link>
                </Text>

                {/* pushes the succeeding contents to the right */}
                <span style={{ flexGrow: 1 }} />

                <ThemeToggleButton />
            </Group>
        </Container>
    </Box>
);

export default Header;
