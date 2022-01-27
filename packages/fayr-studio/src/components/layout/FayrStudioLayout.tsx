import { applyTheme, FAYR_THEME } from "@fayr/shared-components";
import { Dialog, Transition } from "@headlessui/react";
import {
    CogIcon,
    CollectionIcon,
    CurrencyDollarIcon,
    HomeIcon,
    MenuAlt2Icon,
    MicrophoneIcon,
    PresentationChartLineIcon,
    ShieldCheckIcon,
    SpeakerphoneIcon,
    UserGroupIcon,
    XIcon,
} from "@heroicons/react/solid";
import { A } from "components/A";
import Header from "components/layout/Header";
import SidebarNav from "components/navigation/SidebarNav";
import { withRouter, Router } from "next/router";
import React, { Fragment, PropsWithChildren, useState } from "react";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

const FayrLogo = () => (
    <A href="home">
        <img
            src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
            className="h-8 w-auto"
            alt="fayrtv-logo"
            height="70"
            style={{ border: "none" }}
        />
    </A>
);

export default function FayrStudioLayout({ children }: PropsWithChildren<{}>) {
    // https://dev.to/ohitslaurence/creating-dynamic-themes-with-react-tailwindcss-59cl
    const [theme] = React.useState(FAYR_THEME);

    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (rootRef.current?.parentElement) {
            applyTheme(theme, rootRef.current);
        }
    }, [theme]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div ref={rootRef} className="h-full flex">
            {/* Narrow sidebar */}
            <div className="hidden bg-background overflow-y-auto md:block no-scrollbar">
                <div className="w-full py-6 flex flex-col items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <FayrLogo />
                    </div>
                    <div className="px-3">
                        <div className="mx-2 select-none block border-primary mt-4 mb-8 bg-background text-primary flex border-2 justify-center font-upper">
                            STUDIO
                        </div>
                        <SidebarNav
                            items={[
                                {
                                    name: "Home",
                                    href: "home",
                                    icon: HomeIcon,
                                    children: [
                                        {
                                            name: "Dashboard",
                                            href: "home",
                                        },
                                        {
                                            name: "Health Status",
                                            href: "home",
                                        },
                                    ],
                                },
                                {
                                    name: "Stream Manager",
                                    href: "stream-manager",
                                    icon: MicrophoneIcon,
                                    children: [
                                        {
                                            name: "Streaming Tools",
                                            href: "stream-manager",
                                        },
                                        {
                                            name: "Devices",
                                            href: "stream-manager",
                                        },
                                    ],
                                },
                                {
                                    name: "Content",
                                    href: "#",
                                    icon: CollectionIcon,
                                    children: [
                                        {
                                            name: "Library",
                                            href: "#",
                                        },
                                        {
                                            name: "Records",
                                            href: "#",
                                        },
                                    ],
                                },
                                {
                                    name: "Insights",
                                    href: "insights",
                                    icon: PresentationChartLineIcon,
                                    children: [
                                        {
                                            name: "Summary",
                                            href: "insights",
                                        },
                                        {
                                            name: "Analytics",
                                            href: "insights",
                                        },
                                        {
                                            name: "Data",
                                            href: "#",
                                        },
                                        {
                                            name: "Report",
                                            href: "#",
                                        },
                                    ],
                                },
                                {
                                    name: "Community",
                                    href: "community",
                                    icon: UserGroupIcon,
                                    children: [
                                        {
                                            name: "Followers",
                                            href: "community",
                                        },
                                        {
                                            name: "Partners",
                                            href: "community",
                                        },
                                    ],
                                },
                                {
                                    name: "Marketing",
                                    href: "marketing",
                                    icon: SpeakerphoneIcon,
                                    children: [
                                        {
                                            name: "Advertising",
                                            href: "marketing",
                                        },
                                        {
                                            name: "Campaigns",
                                            href: "marketing",
                                        },
                                        {
                                            name: "Social Media",
                                            href: "#",
                                        },
                                    ],
                                },
                                {
                                    name: "Security",
                                    href: "security",
                                    icon: ShieldCheckIcon,
                                    children: [
                                        {
                                            name: "Protection",
                                            href: "security",
                                        },
                                        {
                                            name: "Encryption",
                                            href: "security",
                                        },
                                        {
                                            name: "GDPR",
                                            href: "security",
                                        },
                                    ],
                                },
                                {
                                    name: "Monetization",
                                    href: "monetization",
                                    icon: CurrencyDollarIcon,
                                    children: [
                                        {
                                            name: "Health Status",
                                            href: "monetization",
                                        },
                                        {
                                            name: "Dashboard",
                                            href: "monetization",
                                        },
                                    ],
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
                <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-1 right-0 -mr-14 p-1">
                                        <button
                                            type="button"
                                            className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <XIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                            <span className="sr-only">Close sidebar</span>
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-shrink-0 px-4 flex items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                                        alt="Workflow"
                                    />
                                </div>
                                <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                                    <nav className="h-full flex flex-col">
                                        <div className="space-y-1">
                                            {[
                                                {
                                                    name: "Studio",
                                                    href: "#",
                                                    icon: CollectionIcon,
                                                    current: true,
                                                },
                                                {
                                                    name: "Settings",
                                                    href: "#",
                                                    icon: CogIcon,
                                                    current: false,
                                                },
                                            ].map((item) => (
                                                <A
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-indigo-800 text-white"
                                                            : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                                                        "group py-2 px-3 rounded-md flex items-center text-sm font-medium",
                                                    )}
                                                    aria-current={item.current ? "page" : undefined}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? "text-white"
                                                                : "text-indigo-300 group-hover:text-white",
                                                            "mr-3 h-6 w-6",
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    <span>{item.name}</span>
                                                </A>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="w-full">
                    <div className="relative z-10 h-16 border-b border-gray-200 shadow-sm flex">
                        <button
                            type="button"
                            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <Header />
                    </div>
                </header>

                {/* Main content */}
                <div className="flex-1 flex items-stretch overflow-hidden bg-black text-neutral">
                    <main className="flex-1 overflow-y-auto">
                        {/* Primary column */}
                        <section
                            aria-labelledby="primary-heading"
                            className="min-w-0 flex-1 h-full flex flex-col lg:order-last p-2"
                        >
                            {children}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
