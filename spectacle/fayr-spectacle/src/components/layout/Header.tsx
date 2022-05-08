import { Anchor, Box, Burger, Container, Group, Text } from "~/components/common";
import React from "react";
import ThemeToggleButton from "~/components/layout/ThemeToggleButton";
import { useMediaQuery } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { User } from "~/types/user";
import {Stack} from "@mantine/core";
import SubHeader from "~/components/layout/SubHeader";

type Props = {
    user?: User | null;
};

const Header = ({user}: Props) => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);

    const storeInfo = useStoreInfo();

    const shouldDisplayStoreOwnerHeadline = useMediaQuery("(min-width: 500px)", true);

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
            {user && <SubHeader user={user} />}
        </Stack>
    );
};

export default Header;
