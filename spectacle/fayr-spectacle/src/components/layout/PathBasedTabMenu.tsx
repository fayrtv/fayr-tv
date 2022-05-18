import { Group } from "~/components/common";
import { Text, Container, Paper, Tabs } from "@mantine/core";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export type Tab = {
    title: string;
    slug: string;
    render: () => JSX.Element;
};

type Props = {
    tabs: Tab[];
    pathFragmentName: string;
};

export const PathBasedTabMenu = ({ tabs, pathFragmentName }: Props) => {
    const router = useRouter();
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

    return !activeTab ? null : (
        <Container size="lg">
            <Group align="flex-start" direction="row">
                <Paper>
                    <Tabs
                        variant="pills"
                        orientation="vertical"
                        active={activeTabIndex}
                        onTabChange={(index) => {
                            // TODO: probably need to concat with current path
                            const correspondingView = tabs[index];
                            router.push(`${correspondingView.slug}`).then();
                        }}
                    >
                        {tabs.map((tab, idx) => (
                            <Tabs.Tab key={idx} label={tab.title} p="md" />
                        ))}
                    </Tabs>
                </Paper>
                <Paper>
                    <Text size="xl" color="primary" mb="sm">{activeTab.title}</Text>
                    {activeTab.render()}
                </Paper>
            </Group>
        </Container>
    );
};
