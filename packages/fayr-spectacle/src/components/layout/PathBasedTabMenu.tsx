import {
    Box,
    Burger,
    Center,
    createStyles,
    Group,
    MediaQuery,
    Overlay,
    Paper,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";
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

const useStyles = createStyles((theme) => ({
    tabContentPaper: {
        padding: theme.spacing.sm,
        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.md,
        },
        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            padding: theme.spacing.lg,
        },
    },
    headline: {
        gap: theme.spacing.sm,
        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            gap: theme.spacing.md,
        },
    },
}));

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
    const { classes } = useStyles();

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
            {isMobileNavigationOpen && (
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
            <Group noWrap sx={{ alignItems: "stretch" }}>
                <MediaQuery styles={{ display: "none" }} smallerThan="md">
                    <Paper>
                        <TabStack activeTabIndex={activeTabIndex} router={router} tabs={tabs} />
                    </Paper>
                </MediaQuery>
                <Paper
                    className={classes.tabContentPaper}
                    withBorder={withBorder}
                    shadow={withBorder ? "md" : "none"}
                    sx={{ width: "100%" }}
                >
                    <Group direction="row" mb="md" className={classes.headline}>
                        <MediaQuery styles={{ display: "none" }} largerThan="md">
                            <Burger
                                opened={isMobileNavigationOpen}
                                onClick={() => setIsMobileNavigationOpen((curr) => !curr)}
                                size="sm"
                            ></Burger>
                        </MediaQuery>
                        {renderTitles && activeTab.title && (
                            <Text size="xl" color="primary">
                                {activeTab.title}
                            </Text>
                        )}
                    </Group>
                    {activeTab.render()}
                </Paper>
            </Group>
        </>
    );
};
