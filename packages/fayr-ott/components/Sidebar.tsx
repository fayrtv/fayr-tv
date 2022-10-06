import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Burger } from "@mantine/core";
import { useState } from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  CursorArrowRaysIcon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  { name: 'Security', description: "Your customers' data will be safe and secure.", href: '#', icon: ShieldCheckIcon },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '#',
    icon: Squares2X2Icon,
  },
]
const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayIcon },
  { name: 'View All Products', href: '#', icon: CheckCircleIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function Sidebar() {
    const [opened, setOpened] = useState(false);
    const title = opened ? 'Close navigation' : 'Open navigation';

    return (
        <Popover className="relative z-0">
            {({ open }) => (
                <>
                <div className="relative z-10 bg-white shadow">
                    <div className="mx-auto flex max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Popover.Button
                        className={classNames(
                        open ? 'text-gray-900' : 'text-gray-500',
                        'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                    >
                        <Burger
                        color="#D9D9D9"
                        size="sm"
                        opened={opened}
                        onClick={(Sidebar) => setOpened((o) => !o)}
                        title="Menu"
                        className={classNames(
                            open ? 'text-gray-600' : 'text-gray-400',
                            'ml-2 h-5 w-5 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                        />
                    </Popover.Button>
                    </div>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                >
                    <Popover.Panel className="absolute inset-x-0 z-10 transform shadow-lg">
                    <div className="bg-white">
                        <div className="mx-auto grid max-w-7xl gap-y-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-12 xl:py-16">
                        {solutions.map((item) => (
                            <a
                            key={item.name}
                            href={item.href}
                            className="-m-3 flex flex-col justify-between rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
                            >
                            <div className="flex md:h-full lg:flex-col">
                                <div className="flex-shrink-0">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                </div>
                                <div className="ml-4 md:flex md:flex-1 md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                                <div>
                                    <div className="text-base font-medium text-gray-900">{item.name}</div>
                                    <div className="mt-1 text-sm text-gray-500">{item.description}</div>
                                </div>
                                <div className="mt-2 text-sm font-medium text-indigo-600 lg:mt-4">
                                    Learn more
                                    <span aria-hidden="true"> &rarr;</span>
                                </div>
                                </div>
                            </div>
                            </a>
                        ))}
                        </div>
                    </div>
                    <div className="bg-gray-50">
                        <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-6 lg:px-8">
                        {callsToAction.map((item) => (
                            <div key={item.name} className="flow-root">
                            <a
                                href={item.href}
                                className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100"
                            >
                                <item.icon className="h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{item.name}</span>
                            </a>
                            </div>
                        ))}
                        </div>
                    </div>
                    </Popover.Panel>
                </Transition>
                </>
            )}
        </Popover>
    )
}
