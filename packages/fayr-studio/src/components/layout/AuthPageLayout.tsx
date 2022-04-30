import { applyTheme, FAYR_THEME } from "@fayr/common";
import React, { PropsWithChildren } from "react";

export default function AuthPageLayout({ children }: PropsWithChildren<{}>) {
    React.useEffect(() => {
        applyTheme(FAYR_THEME, document.getElementById("fayr-auth-page-root")!);
    }, []);

    return (
        <div className="h-full w-full" id="fayr-auth-page-root">
            {children}
        </div>
    );
}
