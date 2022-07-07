import React from "react";

type Props = React.HTMLAttributes<SVGElement> & { fill?: string };

export default function FayrLogo({
    fill = "var(--color-primary)",
    className = "h-8 w-auto",
    ...props
}: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 445.1 190"
            fill={fill}
            className={className}
            style={{ border: "none" }}
            {...props}
        >
            <g id="fayr-logo">
                <polygon
                    className="cls-1"
                    points="330.1 0 281.3 0 256.9 73.2 240.9 0 194.4 0 227.6 133.6 227.4 133.6 240.8 190 287 190 273.7 137.2 330.1 0"
                />
                <polygon
                    className="cls-1"
                    points="47.2 98.4 47.2 42.5 102 42.5 112.5 0 0 0 0 190 47.2 190 47.2 141.1 79.7 141.1 90.3 98.4 47.2 98.4"
                />
                <path
                    className="cls-1"
                    d="M127.4,0l-47,190H128l3.8-19.2h44.1l3.9,19.2h44.9L179.7.1Zm12.2,131.9,13.9-70,14.4,70Z"
                />
                <path
                    className="cls-1"
                    d="M445.1,54.6,429.7,0H345.1L289.9,137.1,300.5,190l23.4-48.8h41.9L382.4,190h49.8l-21.3-55.3,21.4-21.4ZM399.9,86.5,387.6,98.8h-42l20.8-54.5h34L405,60.1Z"
                />
            </g>
        </svg>
    );
}
