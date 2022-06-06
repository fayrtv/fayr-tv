import { Button } from "@mantine/core";
import React from "react";

const ResponsiveIconButton: typeof Button = ({ styles, ...props }) => {
    return (
        <Button
            {...props}
            styles={(theme) => ({
                ...styles,
                ...{
                    leftIcon: {
                        [`@media(max-width: ${theme.breakpoints.md}px)`]: {
                            marginRight: 0,
                        },
                    },
                    label: {
                        [`@media(max-width: ${theme.breakpoints.md}px)`]: {
                            display: "none",
                        },
                    },
                },
            })}
        />
    );
};

export default ResponsiveIconButton;
