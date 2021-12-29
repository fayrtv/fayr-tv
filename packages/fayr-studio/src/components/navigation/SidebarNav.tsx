import NavItem from "./NavItem";
import { MaterialIcon } from "@fayr/shared-components";
import React from "react";

type NavEntry = {
    name: string;
    href: string;
    iconProps: React.ComponentProps<typeof MaterialIcon>;
    isSelected: boolean;
    children?: NavEntry[];
};

type Props = { items: Array<NavEntry> };

export default function SidebarNav({ items }: Props) {
    return (
        <div className="flex-1 mt-6 w-full px-2 space-y-1">
            <div className="border-primary text-primary flex border-2 justify-center font-semibold p-0">
                STUDIO
            </div>
            {items.map((item) => (
                <NavItem {...item} />
            ))}
        </div>
    );
}
