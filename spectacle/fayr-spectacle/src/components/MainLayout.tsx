import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren<{}>) {
    return <div style={{ height: "100vh" }}>{children}</div>;
}
