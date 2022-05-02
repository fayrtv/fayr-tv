import { applyTheme, FAYR_THEME, FayrLogo } from "@fayr/common";
import {
    DesktopComputerIcon,
    DeviceMobileIcon,
    ReplyIcon,
    TemplateIcon,
} from "@heroicons/react/outline";
import { ArrowLeftIcon, PlusIcon, ViewBoardsIcon, ViewGridIcon } from "@heroicons/react/solid";
import { NativeSelect } from "@material-ui/core";
import { A } from "components/A";
import { Button } from "components/Button";
import React, { PropsWithChildren } from "react";

const Header = () => (
    <div className="w-full flex flex-row justify-between p-4">
        <div className="flex flex-row gap-6 items-center">
            <ArrowLeftIcon className="bg-background text-white rounded-full w-7 h-7" />
            <FayrLogo />
            <A href="site">Site</A>
            <A href="settings">Settings</A>
            <A href="hire-us">Hire Us</A>
            <A href="help">Help</A>
            <A href="upgrade" className="text-primary">
                Upgrade
            </A>
        </div>
        <div className="flex flex-row items-center gap-6">
            <Button>Preview</Button>
            <Button>Save</Button>
            <Button>Publish</Button>
        </div>
    </div>
);

export default function DesignerLayout({ children }: PropsWithChildren<{}>) {
    React.useEffect(() => {
        applyTheme(FAYR_THEME, document.getElementById("fayr-studio-designer-root")!);
    }, []);

    return (
        <div className="h-full" id="fayr-studio-designer-root">
            <Header />
            <div className="flex flex-row bg-white divide-x divide-neutral border-y border-neutral justify-between">
                <div className="p-2">
                    <ViewGridIcon className="w-7 h-7" />
                </div>
                <div>
                    <select className="border-none w-full">
                        <option selected>Watch Party</option>
                    </select>
                </div>
                <div className="grow"> </div>
                <div className="flex flex-row py-2 px-5 gap-4">
                    {/* No undo/redo icons yet in Heroicons */}
                    <ReplyIcon className="w-6 h-6" />
                    {"Redo"}
                </div>
                <div className="flex flex-row py-2 px-5 gap-4">
                    <DesktopComputerIcon className="w-6 h-6" />
                    <DeviceMobileIcon className="w-6 h-6" />
                </div>
                <div className="py-2 px-5">
                    <TemplateIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="flex flex-row h-full">
                <div className="flex flex-col pt-4 px-2 bg-white border-r border-neutral">
                    <PlusIcon className="bg-background rounded-md text-white w-7 h-7" />
                </div>
                <div className="bg-white w-full bg-blueish">{children}</div>
            </div>
        </div>
    );
}
