import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

export type Crumb = {
    title: string;
    href?: string;
    onClick?: () => void;
};

type Props = {
    items: Array<Crumb>;
};

export const Crumbs = (props: Props) => {
    return (
        <Breadcrumbs mb="md">
            {props.items.map((item, idx) =>
                item.href ? (
                    <Link href={item.href} key={idx} passHref>
                        <Anchor>{item.title}</Anchor>
                    </Link>
                ) : item.onClick ? (
                    // eslint-disable-next-line @next/next/link-passhref
                    <Link href={""} key={idx}>
                        <Anchor onClick={item.onClick}>{item.title}</Anchor>
                    </Link>
                ) : (
                    <Link href={""} key={idx} passHref>
                        <Anchor>{item.title}</Anchor>
                    </Link>
                ),
            )}
        </Breadcrumbs>
    );
};
