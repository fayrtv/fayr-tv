import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";
import { A } from "components/A";
import { useSession } from "next-auth/react";
import { GetBannerDismissalsResponse } from "pages/api/banner-dismissals/[bannerId]";
import React from "react";
import { useQuery } from "react-query";

const BANNER_ID: string = "save-on-fayr-monthly";

export default function Banner() {
    const session = useSession();

    const isDismissed = React.useRef<boolean>();

    const { isLoading, refetch } = useQuery("dismissals", () =>
        fetch(`/api/banner-dismissals/${BANNER_ID}`, { method: "GET" }).then(async (res) => {
            const response = (await res.json()) as GetBannerDismissalsResponse;
            isDismissed.current = response.isDismissed;
        }),
    );

    const setDismissed = React.useCallback(async () => {
        if (!session?.data?.user?.email) {
            return;
        }
        await fetch(`/api/banner-dismissals/${BANNER_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                userId: session.data.user.email,
            }),
        });
        await refetch();
    }, [session?.data?.user?.email, refetch]);

    return isLoading || isDismissed.current ? (
        <></>
    ) : (
        <div className="inset-x-0 pb-2 sm:pb-5">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="p-2 rounded-lg bg-gray shadow-lg sm:p-3">
                    <div className="flex items-center justify-between flex-wrap">
                        <div className="w-0 flex-1 flex items-center">
                            <span className="flex p-2 rounded-lg bg-primary">
                                <SpeakerphoneIcon
                                    className="h-6 w-6 text-black"
                                    aria-hidden="true"
                                />
                            </span>
                            <p className="ml-3 font-medium text-black truncate">
                                <span className="md:hidden">Save up to 20% on FAYR monthly!</span>
                                <span className="hidden md:inline">
                                    Give your streaming platform time to grow. Get FAYR monthly or
                                    select yearly to save up to 20%.
                                </span>
                            </p>
                        </div>
                        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <A
                                href="/promotion"
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
                                font-medium text-black bg-primary hover:ring-2 hover:ring-white hover:bg-primary-light"
                            >
                                Select a plan
                            </A>
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                            <button
                                type="button"
                                className="-mr-1 flex p-2 rounded-md hover:bg-gray focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={setDismissed}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
