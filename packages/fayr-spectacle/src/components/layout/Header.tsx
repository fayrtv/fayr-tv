import {
    Anchor,
    Box,
    Burger,
    Container,
    Group,
    Text,
    Header as MantineHeader,
    MediaQuery,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useStoreInfo } from "~/components/StoreInfoProvider";
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

    const { ref, height } = useElementSize();

    return (
        <MantineHeader height={height === 0 ? 150 : height}>
            <div ref={ref}>
                <Box
                    py="md"
                    sx={{
                        textAlign: "center",
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
                                    <Text
                                        transform="uppercase"
                                        size="sm"
                                        style={{ display: "inline" }}
                                    >
                                        {storeInfo.name}
                                    </Text>
                                    <Text size="sm" style={{ display: "inline" }}>
                                        {" "}
                                        {storeInfo.city}
                                        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                                            <span> | Inhaber: {storeInfo.owner}</span>
                                        </MediaQuery>
                                    </Text>{" "}
                                </Anchor>
                            </Link>
                            <Group
                                direction="row"
                                position="apart"
                                style={{ width: "100%" }}
                                mt="xs"
                            >
                                <Link href="/" passHref>
                                    <Anchor>
                                        <Text color="primary" size="xl" weight="bold">
                                            Digitaler Brillenpass
                                        </Text>
                                    </Anchor>
                                </Link>

                                <Burger
                                    color="white"
                                    opened={burgerOpen}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setBurgerOpen(!burgerOpen);
                                    }}
                                />
                            </Group>
                        </Group>
                    </Container>
                </Box>

                {subHeader.enabled && !!user && <SubHeader {...subHeader.props} />}
            </div>
        </MantineHeader>
    );
};

export default Header;
