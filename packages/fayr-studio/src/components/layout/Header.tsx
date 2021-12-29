import { BellIcon, EyeIcon, PlusSmIcon, ViewGridIcon } from "@heroicons/react/solid";
import { ProfileDropdown } from "components/layout/ProfileDropdown";
import React, { PropsWithChildren } from "react";

const IconElement = ({ children }: PropsWithChildren<{}>) => (
    <button
        className="flex bg-gray items-center justify-center focus:outline-none
    focus:ring-2 focus:ring-neutral focus:bg-primary focus:text-black p-2 text-neutral"
    >
        {children}
    </button>
);

const Header = () => (
    <div className="bg-background flex-1 flex justify-between px-4 sm:px-6 py-6">
        <div className="relative w-full text-gray-400 focus-within:text-gray-600" />

        <div className="ml-2 flex items-center space-x-6 sm:ml-6">
            <IconElement>
                <ProfileDropdown>
                    <img
                        className="h-6 w-6"
                        src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                        alt=""
                    />
                </ProfileDropdown>
            </IconElement>

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
                <EyeIcon className="h-6 w-6" aria-hidden="true" />
            </IconElement>
        </div>
    </div>
);
export default Header;
