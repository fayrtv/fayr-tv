import { AppShell } from "@mantine/core";
import React, { ComponentProps, PropsWithChildren, ReactChild } from "react";

import Header from "~/components/layout/Header";
import { Anchor, Aside, Navbar } from "@mantine/core";
import { useRouter } from "next/router";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import { Sidebar } from "~/components/layout/Sidebar";



type Props = {
    children: ReactChild;
    subHeader?: ComponentProps<typeof Header>["subHeader"];
};

const Layout = ({ children, subHeader = { enabled: true } }: Props) => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);
    return (
        <AppShell
            header={
                <Header
                    burgerOpen={burgerOpen}
                    setBurgerOpen={setBurgerOpen}
                    subHeader={subHeader}
                />
            }
            styles={{
                root: { height: "100vh", display: "flex", flexDirection: "column" },
                main: { padding: 0 },
                body: { flexGrow: 1 },
            }}
            aside={
                <Sidebar open={burgerOpen} />
            }
        >
            {children}
        </AppShell>
    );
};

export function layoutFactory(props: Omit<Props, "children">) {
    // eslint-disable-next-line react/display-name
    return ({ children }: Pick<Props, "children">) => <Layout {...props}>{children}</Layout>;
}

export default Layout;
