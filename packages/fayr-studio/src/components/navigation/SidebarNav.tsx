import NavItem from "./NavItem";
import { MaterialIcon } from "@fayr/shared-components";
import React from "react";
import tw, { GlobalStyles } from "twin.macro";

type NavEntry = {
    name: string;
    href: string;
    iconProps: React.ComponentProps<typeof MaterialIcon>;
    isSelected: boolean;
    children?: NavEntry[];
};

const Wrapper = tw.div`flex-1 mt-6 w-full px-2 space-y-1`;
const StudioHeadlineBox = tw.div`flex border-2 justify-center font-semibold p-0`;

type Props = { items: Array<NavEntry> };

export default function SidebarNav({ items }: Props) {
    return (
        <Wrapper>
            <GlobalStyles />
            <StudioHeadlineBox className="border-primary text-primary">STUDIO</StudioHeadlineBox>
            {items.map((item) => (
                <NavItem {...item} />
            ))}
        </Wrapper>
    );
}
