import RadioSelectGroup from "components/RadioSelectGroup";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import { formatPlatformType } from "platform-config/platform-type/PlatformType";
import React from "react";

const ACCESS_LEVEL_SETTINGS = [
    {
        id: "public-access",
        name: "Public access",
        description: "This project would be available to anyone who has the link",
    },
    {
        id: "project-members",
        name: "Private to Project Members",
        description: "Only members of this project would be able to access",
    },
    {
        id: "private",
        name: "Private to you",
        description: "You are the only one able to access this project",
    },
];

export default function SettingsScreen() {
    const {
        type,
        info: { name, companyName, welcomeMessage },
        setInfo,
    } = React.useContext(PlatformConfiguratorContext);

    const [selected, setSelected] = React.useState(ACCESS_LEVEL_SETTINGS[0].id);

    return (
        <form className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                {/*<div key={key} className="flex flex-col ">*/}
                {/*    <div className="flex-1 space-y-4 bg-gray p-4 flex flex-col justify-between text-black text-sm">*/}

                <div className="bg-gray rounded-sm shadow-lg overflow-hidden text-black p-4">
                    <h3 className="text-lg font-medium">Platform Configuration</h3>
                    <p className="mt-1 max-w-2xl text-sm">
                        This is what users see when they enter your
                        {type ? " " + formatPlatformType(type) : ""} platform.
                    </p>

                    <div className="mt-6 sm:mt-5 space-y-4 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray sm:pt-5">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium sm:mt-px sm:pt-2"
                            >
                                Name
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral bg-gray-50  sm:text-sm">
                                        fayr.tv/
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(ev) =>
                                            setInfo((curr) => ({ ...curr, name: ev.target.value }))
                                        }
                                        name="name"
                                        id="name"
                                        className="flex-1 block w-full focus:ring-neutral focus:border-neutral min-w-0 rounded-none rounded-r-md sm:text-sm border-neutral"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                                htmlFor="about"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                                Welcome message
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <textarea
                                    id="welcomeMessage"
                                    name="welcomeMessage"
                                    value={welcomeMessage ?? ""}
                                    onChange={(ev) =>
                                        setInfo((curr) => ({
                                            ...curr,
                                            welcomeMessage: ev.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                    defaultValue={""}
                                />
                                <p className="mt-2 text-sm ">
                                    Let users know what your platform is about.
                                </p>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                                htmlFor="photo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Photo
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        <svg
                                            className="h-full w-full text-gray-300"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label
                                htmlFor="cover-photo"
                                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                            >
                                Cover photo
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs ">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <RadioSelectGroup
                    label="Access"
                    items={ACCESS_LEVEL_SETTINGS}
                    selected={selected}
                    onChange={setSelected}
                />
            </div>
        </form>
    );
}
