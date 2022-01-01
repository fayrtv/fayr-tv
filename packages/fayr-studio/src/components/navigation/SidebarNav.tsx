import NavItem from "./NavItem";
import React from "react";

type NavEntry = {
    name: string;
    href: string;
    icon: React.FunctionComponent<React.ComponentProps<"svg">>;
    isSelected: boolean;
    children?: NavEntry[];
};

type Props = { items: Array<NavEntry> };

export default function SidebarNav({ items }: Props) {
    return (
        <div className="flex-column px-4 space-y-1">
            <div className="border-primary mt-2 bg-background text-primary flex border-2 justify-center font-semibold p-0">
                STUDIO
            </div>
            {items.map((item) => (
                <NavItem {...item} />
            ))}
        </div>
    );
}
