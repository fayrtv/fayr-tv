import { BellIcon, EyeIcon, UserCircleIcon, ViewGridIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { session } from "next-auth/core/routes";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { HTMLProps, PropsWithChildren } from "react";

const IconElement = ({
    children,
    ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>) => (
    <button
        className="flex bg-blueish items-center justify-center focus:outline-none
    focus:ring-1 focus:ring-neutral focus:bg-primary focus:text-black
    hover:ring-1 hover:ring-neutral hover:bg-primary hover:text-black
     p-2 text-neutral block"
        {...props}
    >
        {children}
    </button>
);

const ProfileIcon = ({ name, image }: { name?: string | null; image?: string | null }) => {
    return (
        <a href="#" className="group block h-6">
            <div className="flex">
                <div>
                    {image ? (
                        <img className="inline-block w-6 rounded-full" src={image} alt="Profile" />
                    ) : (
                        <span className="inline-block w-6 rounded-full overflow-hidden bg-gray-100">
                            <svg
                                className="h-full w-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    )}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{name ?? "Unknown User"}</p>
                </div>
            </div>
        </a>
    );
};
const Header = () => {
    const { data } = useSession();

    const [profileExpanded, setProfileExpanded] = React.useState(false);

    const toggleProfileDropdown = () => {
        setProfileExpanded(!profileExpanded);
    };

    return (
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

                <IconElement onMouseEnter={() => data?.user && setProfileExpanded(true)}>
                    {data?.user ? (
                        <ProfileIcon name={data.user.name} image={data.user.image} />
                    ) : (
                        <UserCircleIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                            onClick={() => signIn()}
                        />
                    )}
                </IconElement>
                {profileExpanded && (
                    <div className="relative">
                        <div className="origin-top-right absolute right-0 mt-6 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <button
                                className="block px-4 py-2 text-sm text-gray-700"
                                onClick={() => signOut()}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Header;
