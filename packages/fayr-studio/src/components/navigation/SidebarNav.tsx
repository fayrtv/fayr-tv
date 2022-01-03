import NavItem from "./NavItem";
import React from "react";

type NavEntry = {
    name: string;
    href: string;
    icon?: React.FunctionComponent<React.ComponentProps<"svg">>;
    isSelected: boolean;
    children?: NavEntry[];
};

type Props = { items: Array<NavEntry> };

export default function SidebarNav({ items }: Props) {
    return (
        <div className="flex-column space-y-1">
            {items.map((item) => (
                <NavItem {...item} />
            ))}
        </div>
    );
}
