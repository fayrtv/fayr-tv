import Link from "next/link";
import React from "react";

// TODO: Es wäre sicher nützlich, das hier für alle Anchors zu verwenden
// wenn jemand Zeit hat, gerne tun

export function A(props: React.AllHTMLAttributes<HTMLAnchorElement>): JSX.Element {
    const { href, children, ...rest } = props;
    const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

    if (isInternalLink) {
        return (
            <Link href={href} passHref>
                <a {...rest}>{children}</a>
            </Link>
        );
    }

    return (
        <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
            {children}
        </a>
    );
}
