import { Anchor, Box, Burger, Container, Group, Text } from "~/components/common";
import ThemeToggleButton from "~/components/layout/ThemeToggleButton";
import { useMediaQuery } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { User } from "~/types/user";
import { Stack } from "@mantine/core";
import { MobileWidthThreshold } from "~/constants/mediaqueries";

type Props = {
    user?: User | null;
    burgerOpen: boolean;
    setBurgerOpen: (open: boolean) => void;
};

const Header = ({ user, burgerOpen, setBurgerOpen }: Props) => {
    const storeInfo = useStoreInfo();

    const shouldDisplayStoreOwnerHeadline = useMediaQuery(
        `(min-width: ${MobileWidthThreshold}px)`,
        true,
    );

    return (
        <Stack>
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
                            <Text transform="uppercase" size="sm" style={{ display: "inline" }}>
                                {storeInfo.name}
                            </Text>
                            <Text size="sm" style={{ display: "inline" }}>
                                {" "}
                                {storeInfo.city}
                                {shouldDisplayStoreOwnerHeadline && (
                                    <> | Inhaber: {storeInfo.owner}</>
                                )}
                            </Text>{" "}
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
                                onClick={() => setBurgerOpen(!burgerOpen)}
                            />
                        </Group>
                    </Group>
                </Container>
            </Box>
        </Stack>
    );
};

export default Header;
