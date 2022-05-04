import { AppShell, Container, Navbar, useMantineTheme } from "@mantine/core";
import { ReactChild } from "react";

import Header from "./header";

type Props = {
    children: ReactChild;
};
const Layout = ({ children }: Props) => {
    return (
        <AppShell padding="md" header={<Header />}>
            <Container>{children}</Container>
        </AppShell>
    );
};

export default Layout;
