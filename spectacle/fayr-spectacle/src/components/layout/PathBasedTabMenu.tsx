import {
    Text,
    Container,
    Grid,
    Paper,
    Tabs,
    Burger,
    Group,
    Overlay,
    Center,
    Stack,
    ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { X } from "tabler-icons-react";

export type Tab = {
    title: string;
    slug: string;
    render: () => JSX.Element;
};

type Props = {
    tabs: Tab[];
    pathFragmentName: string;
};

type TabStackProps = {
    activeTabIndex?: number;
    router: NextRouter;
    tabs: Tab[];
    onRoutePushed?(): void;
};

const TabStack = ({ activeTabIndex, router, onRoutePushed, tabs }: TabStackProps) => {
    return (
        <Tabs
            variant="pills"
            orientation="vertical"
            active={activeTabIndex}
            onTabChange={(index) => {
                // TODO: probably need to concat with current path
                const correspondingView = tabs[index];
                router.push(`${correspondingView.slug}`).then((_) => onRoutePushed?.());
            }}
        >
            {tabs.map((tab, idx) => (
                <Tabs.Tab key={idx} label={tab.title} p="md" />
            ))}
        </Tabs>
    );
};

export const PathBasedTabMenu = ({ tabs, pathFragmentName }: Props) => {
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);
    const urlFragment = router.query[pathFragmentName]?.[0] as string | undefined;

    const activeTabIndex = useMemo(() => {
        if (!urlFragment) {
            return undefined;
        }
        return tabs.findIndex((x: Tab) => x.slug.toLowerCase() === urlFragment.toLowerCase());
    }, [tabs, urlFragment]);

    useEffect(() => {
        if (activeTabIndex === undefined) {
            router.push(tabs[0].slug).then();
        }
    });

    const activeTab = activeTabIndex !== undefined ? tabs[activeTabIndex] : undefined;

    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = React.useState(false);

    return !activeTab ? null : (
        <Container
            size="lg"
            sx={{
                padding: isMobile ? "10px" : "50px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            {isMobile && isMobileNavigationOpen && (
                <Overlay opacity={0.85}>
                    <Center style={{ height: "100%", width: "100%" }}>
                        <Stack>
                            <ThemeIcon
                                radius="xl"
                                size="lg"
                                onClick={() => setIsMobileNavigationOpen(false)}
                                sx={(_) => ({ alignSelf: "flex-end" })}
                            >
                                <X />
                            </ThemeIcon>
                            <TabStack
                                activeTabIndex={activeTabIndex}
                                router={router}
                                onRoutePushed={() => setIsMobileNavigationOpen(false)}
                                tabs={tabs}
                            />
                        </Stack>
                    </Center>
                </Overlay>
            )}
            <Grid columns={5}>
                {!isMobile && (
                    <Grid.Col span={1}>
                        <Paper>
                            <TabStack activeTabIndex={activeTabIndex} router={router} tabs={tabs} />
                        </Paper>
                    </Grid.Col>
                )}
                <Grid.Col span={isMobile ? 5 : 4}>
                    <Paper>
                        <Group direction="row">
                            {isMobile && (
                                <Burger
                                    opened={isMobileNavigationOpen}
                                    onClick={() => setIsMobileNavigationOpen((curr) => !curr)}
                                    size="sm"
                                ></Burger>
                            )}
                            <Text size="xl" color="primary" mb={isMobile ? 0 : "sm"}>
                                {activeTab.title}
                            </Text>
                        </Group>
                        {activeTab.render()}
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
