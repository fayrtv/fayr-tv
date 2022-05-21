import { Anchor, Box, Burger, Container, Group, Text } from "@mantine/core";
import ThemeToggleButton from "~/components/layout/ThemeToggleButton";
import { useMediaQuery } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";
import { Stack } from "@mantine/core";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { ComponentProps } from "react";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import SubHeader from "~/components/layout/SubHeader";

type Props = {
    burgerOpen: boolean;
    setBurgerOpen: (open: boolean) => void;
    subHeader:
        | {
              enabled: false;
              props?: undefined;
          }
        | {
              enabled: true;
              props?: Omit<ComponentProps<typeof SubHeader>, "user">;
          };
};

const Header = ({ burgerOpen, setBurgerOpen, subHeader }: Props) => {
    const storeInfo = useStoreInfo();
    const { user } = useSession();

    const shouldDisplayStoreOwnerHeadline = useMediaQuery(
        `(min-width: ${MobileWidthThreshold}px)`,
        true,
    );

    return (
        <Stack spacing={0}>
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
                        <Link href="/" passHref>
                            <Anchor
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
                        </Link>
                        <Group direction="row" position="apart" style={{ width: "100%" }} mt="xs">
                            <Link href="/" passHref>
                                <Anchor>
                                    <Text color="primary" size="xl" weight="bold">
                                        Digitaler Brillenpass
                                    </Text>
                                </Anchor>
                            </Link>
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

            {subHeader.enabled && !!user && <SubHeader {...subHeader.props} />}
        </Stack>
    );
};

export default Header;
