import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import { A } from "components/A";
import { Router, withRouter } from "next/router";
import React from "react";

type NavItemProps = {
    name: string;
    href: string;
    icon?: React.FunctionComponent<React.ComponentProps<"svg">>;
    children?: NavItemProps[];
};

const NavItem = ({ router, href, icon, name, children }: NavItemProps & { router: Router }) => {
    const normalizedHref = `/${href[0] === "/" ? href.substring(1) : href}`;
    const isCurrentPath = router.pathname === normalizedHref || router.asPath === normalizedHref;

    const colorClass = isCurrentPath ? "text-white" : "text-neutral";

    return !children ? (
        <div key={name}>
            <A
                href={href}
                className={classNames(
                    "group w-full flex items-center pl-2 py-2 text-sm font-medium",
                    colorClass,
                    "group-hover:text-primary",
                )}
            >
                {icon &&
                    React.createElement(icon, {
                        className: classNames(
                            "mr-3 flex-shrink-0 h-6 w-6 text-neutral",
                            colorClass,
                            "group-hover:text-primary",
                        ),
                    })}
                {name}
            </A>
        </div>
    ) : (
        <Disclosure as="div" key={name} className="space-y-1" defaultOpen={isCurrentPath}>
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={classNames(
                            "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500",
                            colorClass,
                            "group-hover:text-primary",
                        )}
                    >
                        {icon &&
                            React.createElement(icon, {
                                className: classNames("mr-3 flex-shrink-0 h-6 w-6", colorClass),
                            })}
                        <span className="flex-1">{name}</span>
                        <svg
                            className={classNames(
                                open ? "rotate-90" : "",
                                "text-neutral ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-primary transition-colors ease-in-out duration-150",
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
                                className={classNames(
                                    "group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium",
                                    colorClass,
                                    "group-hover:text-primary",
                                )}
                            >
                                {subItem.name}
                            </Disclosure.Button>
                        ))}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default withRouter(NavItem);
