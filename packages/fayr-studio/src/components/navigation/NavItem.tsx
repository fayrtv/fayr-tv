import { MaterialIcon } from "@fayr/shared-components";
import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import React from "react";

type NavItemProps = {
    name: string;
    href: string;
    isSelected: boolean;
    iconProps: React.ComponentProps<typeof MaterialIcon>;
    children?: NavItemProps[];
};

export default function NavItem({ href, iconProps, isSelected, name, children }: NavItemProps) {
    return !children ? (
        <div key={name}>
            <a
                href={href}
                className={classNames(
                    isSelected
                        ? "bg-blueish text-gray"
                        : "bg-white text-blueish hover:bg-gray-50 hover:text-gray-900",
                    "group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md",
                )}
            >
                <MaterialIcon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                    {...iconProps}
                />
            </a>
        </div>
    ) : (
        <Disclosure as="div" key={name} className="space-y-1">
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={classNames(
                            isSelected
                                ? "bg-gray-100 text-gray-900"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500",
                        )}
                    >
                        <MaterialIcon
                            className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                            {...iconProps}
                        />
                        <span className="flex-1">{name}</span>
                        <svg
                            className={classNames(
                                open ? "text-gray-400 rotate-90" : "text-gray-300",
                                "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150",
                            )}
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                        </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                        {children.map((subItem) => (
                            <Disclosure.Button
                                key={subItem.name}
                                as="a"
                                href={subItem.href}
                                className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                            >
                                {subItem.name}
                            </Disclosure.Button>
                        ))}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
