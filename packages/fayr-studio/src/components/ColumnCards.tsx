import React, { Dispatch } from "react";

export type Card = {
    key: string;
    icon: React.FunctionComponent<React.ComponentProps<"svg">>;
    title: string;
    description: string | JSX.Element;
    ctaPrimary: string | JSX.Element;
    onCtaPrimaryClicked: Dispatch<void>;
    ctaSecondary?: string;
    onCtaSecondaryClicked?: Dispatch<void>;
};

type Props = { cards: Card[] };

function PrimaryCtaButtonDivider({
    ctaPrimary,
    onClick,
}: Pick<Card, "ctaPrimary"> & { onClick: Dispatch<void> }) {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral" />
            </div>
            <div className="relative flex justify-center">
                <button
                    onClick={() => onClick()}
                    type="button"
                    className="inline-flex items-center shadow-sm px-4 py-1.5 border border-neutral
                    font-medium leading-5 rounded-full text-black bg-primary hover:ring-1
                    hover:border-white hover:ring-white focus:outline-none"
                >
                    {ctaPrimary}
                </button>
            </div>
        </div>
    );
}

export default function ColumnCards({ cards }: Props) {
    return (
        <div className="grid gap-10 max-w-3xl lg:grid-cols-3">
            {cards.map(
                ({
                    key,
                    description,
                    title,
                    icon,
                    ctaPrimary,
                    onCtaPrimaryClicked,
                    ctaSecondary,
                    onCtaSecondaryClicked,
                }) => (
                    <div key={key} className="flex flex-col rounded-sm shadow-lg overflow-hidden">
                        <div className="flex-1 space-y-2 bg-gray p-4 flex flex-col justify-between">
                            <p className="text-xl font-upper text-black self-center">
                                <div className="flex flex-row space-x-2 items-center">
                                    {React.createElement(icon, { className: "w-6 h-6 inline" })}
                                    <span className="select-none">{title}</span>
                                </div>
                            </p>
                            <p className="mt-3 text-sm text-black">{description}</p>
                            {ctaSecondary && (
                                <button
                                    className="block bg-black text-neutral py-2"
                                    onClick={() => onCtaSecondaryClicked?.()}
                                >
                                    {ctaSecondary}
                                </button>
                            )}
                            <PrimaryCtaButtonDivider
                                ctaPrimary={ctaPrimary}
                                onClick={onCtaPrimaryClicked}
                            />
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}
