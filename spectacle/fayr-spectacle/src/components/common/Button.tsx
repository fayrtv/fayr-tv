import { Button as MantineButton, ButtonProps } from "@mantine/core";
import React from "react";

type ButtonComponent = (<C = "button">(props: ButtonProps<C>) => React.ReactElement) & {
    displayName?: string;
};

export const Button: ButtonComponent = ({ children, styles, ...props }) => {
    return (
        <MantineButton styles={{ inner: { fontWeight: "lighter" }, ...styles }} {...props}>
            {children}
        </MantineButton>
    );
};
