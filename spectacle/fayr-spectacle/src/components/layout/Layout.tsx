import { AppShell } from "~/components/common";
import { ReactChild } from "react";

import Header from "~/components/layout/Header";

type Props = {
    children: ReactChild;
};
const Layout = ({ children }: Props) => {
    return (
        <AppShell
            header={<Header />}
            styles={{
                root: { height: "100vh", display: "flex", flexDirection: "column" },
                main: { padding: 0 },
                body: { flexGrow: 1 },
            }}
        >
            {children}
        </AppShell>
    );
};

export default Layout;
