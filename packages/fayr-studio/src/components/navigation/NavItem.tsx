import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import React from "react";

type NavItemProps = {
    name: string;
    href: string;
    isSelected: boolean;
    icon: React.FunctionComponent<React.ComponentProps<"svg">>;
    children?: NavItemProps[];
};

export default function NavItem({ href, icon, isSelected, name, children }: NavItemProps) {
    return !children ? (
        <div key={name}>
            <a
                href={href}
                className="group text-white w-full flex items-center pl-2 py-2 text-sm font-medium"
            >
                {React.createElement(icon, { className: "mr-3 flex-shrink-0 h-6 w-6 text-white" })}
                {name}
            </a>
        </div>
    ) : (
        <Disclosure as="div" key={name} className="space-y-1">
            {({ open }) => (
                <>
                    <Disclosure.Button className="group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 text-white">
                        {React.createElement(icon, {
                            className: "mr-3 flex-shrink-0 h-6 w-6 text-white",
                        })}
                        <span className="flex-1">{name}</span>
                        <svg
                            className={classNames(
                                open ? "rotate-90" : "",
                                "text-white ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150",
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
                                className="text-white group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium"
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
