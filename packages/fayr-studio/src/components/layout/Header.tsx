import { BellIcon, EyeIcon, UserCircleIcon, ViewGridIcon } from "@heroicons/react/solid";
import React, { PropsWithChildren } from "react";

const IconElement = ({ children }: PropsWithChildren<{}>) => (
    <button
        className="flex bg-blueish items-center justify-center focus:outline-none
    focus:ring-1 focus:ring-neutral focus:bg-primary focus:text-black
    hover:ring-1 hover:ring-neutral hover:bg-primary hover:text-black
     p-2 text-neutral block"
    >
        {children}
    </button>
);

const Header = () => (
    <div className="bg-background flex-1 flex justify-between px-4 sm:px-6 py-6">
        <div className="relative w-full text-gray" />

        <div className="ml-2 flex items-center space-x-4 sm:ml-6">
            <IconElement>
                <EyeIcon className="h-6 w-6" aria-hidden="true" />
            </IconElement>

            <IconElement>
                <ViewGridIcon className="h-6 w-6" aria-hidden="true" />
            </IconElement>

            <IconElement>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
            </IconElement>

            <IconElement>
                <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
            </IconElement>
        </div>
    </div>
);
export default Header;
