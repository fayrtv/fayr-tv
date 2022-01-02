import React from "react";

function SettingsScreen() {
    return (
        <div className="mt-10 divide-y divide-gray-200">
            <div className="space-y-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                <p className="max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                </p>
            </div>
            <div className="mt-6">
                <dl className="divide-y divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="flex-grow">Chelsea Hagon</span>
                            <span className="ml-4 flex-shrink-0">
                                <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Update
                                </button>
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                        <dt className="text-sm font-medium text-gray-500">Photo</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="flex-grow">
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                            </span>
                            <span className="ml-4 flex-shrink-0 flex items-start space-x-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Update
                                </button>
                                <span className="text-gray-300" aria-hidden="true">
                                    |
                                </span>
                                <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Remove
                                </button>
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="flex-grow">chelsea.hagon@example.com</span>
                            <span className="ml-4 flex-shrink-0">
                                <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Update
                                </button>
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200">
                        <dt className="text-sm font-medium text-gray-500">Job title</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className="flex-grow">Human Resources Manager</span>
                            <span className="ml-4 flex-shrink-0">
                                <button
                                    type="button"
                                    className="bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Update
                                </button>
                            </span>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

export default SettingsScreen;
