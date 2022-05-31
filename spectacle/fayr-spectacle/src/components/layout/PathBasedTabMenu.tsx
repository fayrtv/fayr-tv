import {
    Burger,
    Center,
    Grid,
    Group,
    Overlay,
    Paper,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";
import { X } from "tabler-icons-react";

export type Tab = {
    title?: string;
    slug: string;
    render: () => JSX.Element;
};

type Props = {
    tabs: Tab[];
    pathFragmentName: string;
    renderOnRootPath?: () => JSX.Element;
    renderTitles?: boolean;
    withBorder?: boolean;
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

export const useUrlFragment = (pathFragmentName: string) => {
    const router = useRouter();
    return router.query[pathFragmentName]?.[0] as string | undefined;
};

export const PathBasedTabMenu = ({
    tabs,
    pathFragmentName,
    renderOnRootPath,
    renderTitles,
    withBorder = true,
}: Props) => {
    const urlFragment = useUrlFragment(pathFragmentName);
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 900px)`, true);

    const activeTabIndex = useMemo(() => {
        if (!urlFragment) {
            return undefined;
        }
        return tabs.findIndex((x: Tab) => x.slug.toLowerCase() === urlFragment.toLowerCase());
    }, [tabs, urlFragment]);

    useEffect(() => {
        if (activeTabIndex === undefined && !renderOnRootPath) {
            router.push(tabs[0].slug).then();
        }
    });

    const activeTab = useMemo(
        () => (activeTabIndex !== undefined ? tabs[activeTabIndex] : undefined),
        [activeTabIndex, tabs],
    );

    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = React.useState(false);

    return !activeTab ? (
        renderOnRootPath?.() ?? null
    ) : (
        <>
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
                    <Paper withBorder={withBorder} p={isMobile ? "md" : "lg"}>
                        <Group direction="row">
                            {isMobile && (
                                <Burger
                                    opened={isMobileNavigationOpen}
                                    onClick={() => setIsMobileNavigationOpen((curr) => !curr)}
                                    size="sm"
                                ></Burger>
                            )}
                            {renderTitles && activeTab.title && (
                                <Text size="xl" color="primary" mb={isMobile ? 0 : "sm"}>
                                    {activeTab.title}
                                </Text>
                            )}
                        </Group>
                        {activeTab.render()}
                    </Paper>
                </Grid.Col>
            </Grid>
        </>
    );
};
