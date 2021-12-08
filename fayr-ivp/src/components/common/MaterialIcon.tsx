// Framework
import * as React from "react";

// Functionality
import classNames from "classnames";

export enum MaterialIconType {
    Outlined,
    Filled,
    Rounded,
    Sharp,
    TwoTone,
}

export type MaterialIconProps<T> = {
    iconName: string;
    color?: string;
    size?: number | string;
    onClick?(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): T;
    className?: string;
    type?: keyof typeof MaterialIconType;
};

export const MaterialIcon: React.FC<MaterialIconProps<void>> = ({
    className,
    iconName,
    color,
    size,
    onClick,
    type = "Filled",
}) => {
    const classes = classNames(
        {
            "material-icons": type === "Filled",
            "material-icons-outlined": type === "Outlined",
            "material-icons-round": type === "Rounded",
            "material-icons-sharp": type === "Rounded",
            "material-icons-two-tone": type === "TwoTone",
        },
        className ?? "",
    );

    if (!size) {
        size = 24;
    }

    if (!color) {
        color = "black";
    }

    return (
        <span
            onClick={(event) => onClick?.(event)}
            className={classes}
            style={{
                fontSize: size,
                color: color,
                userSelect: "none",
                cursor: onClick === undefined ? "auto" : "pointer",
            }}
        >
            {iconName}
        </span>
    );
};

export default MaterialIcon;
