import { AppShell } from "@mantine/core";
import React, { ComponentProps, ReactChild } from "react";

import Header from "~/components/layout/Header";
import { Sidebar } from "~/components/layout/Sidebar";

type Props = {
    children: ReactChild;
    subHeader?: ComponentProps<typeof Header>["subHeader"];
};

const Layout = ({ children, subHeader = { enabled: true } }: Props) => {
    const [burgerRef, setBurgerRef] = React.useState<HTMLElement | null>(null);
    const [burgerOpen, setBurgerOpen] = React.useState(false);

    return (
        <AppShell
            header={
                <Header
                    burgerOpen={burgerOpen}
                    setBurgerOpen={setBurgerOpen}
                    // setBurgerRef={setBurgerRef}
                    subHeader={subHeader}
                />
            }
            styles={{
                root: { height: "100vh", display: "flex", flexDirection: "column" },
                main: { padding: 0 },
                body: { flexGrow: 1 },
            }}
            aside={
                <Sidebar
                    open={burgerOpen}
                    onClickOutside={() => setBurgerOpen(false)}
                    // burgerRef={burgerRef}
                />
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