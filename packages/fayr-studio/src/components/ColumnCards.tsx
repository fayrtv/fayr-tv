/* This example requires Tailwind CSS v2.0+ */
import React from "react";

export type Card = {
    key: string;
    icon: React.FunctionComponent<React.ComponentProps<"svg">>;
    title: string;
    description: string | JSX.Element;
    ctaPrimary: string | JSX.Element;
    ctaSecondary?: string | JSX.Element;
};

type Props = { cards: Card[] };

function PrimaryCtaButtonDivider({ ctaPrimary }: Pick<Card, "ctaPrimary">) {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral" />
            </div>
            <div className="relative flex justify-center">
                <button
                    type="button"
                    className="inline-flex items-center shadow-sm px-4 py-1.5 border border-neutral
                    font-medium leading-5 rounded-full text-black bg-primary hover:ring-1
                    hover:border-white hover:ring-white focus:outline-none"
                >
                    {/*<PlusSmIcon className="-ml-1.5 mr-1 h-5 w-5 text-black" aria-hidden="true" />*/}
                    <span>{ctaPrimary}</span>
                </button>
            </div>
        </div>
    );
}

export default function ColumnCards({ cards }: Props) {
    return (
        <div className="relative mx-auto">
            <div className="grid gap-10 lg:grid-cols-3">
                {cards.map(({ key, description, title, icon, ctaPrimary, ctaSecondary }) => (
                    <div key={key} className="flex flex-col rounded-md shadow-lg overflow-hidden">
                        <div className="flex-1 space-y-2 bg-gray p-6 flex flex-col justify-between">
                            <p className="text-lg font-semibold text-black self-center">
                                <div className="flex flex-row space-x-2 items-center">
                                    {React.createElement(icon, { className: "w-8 h-8 inline" })}
                                    <span>{title}</span>
                                </div>
                            </p>
                            <p className="mt-3 text-base text-black">{description}</p>
                            {ctaSecondary && (
                                <button className="block bg-black text-neutral py-1">
                                    {ctaSecondary}
                                </button>
                            )}
                            <PrimaryCtaButtonDivider ctaPrimary={ctaPrimary} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
