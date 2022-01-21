import React from "react";
import { HTMLElementProps } from "type-utils";

type Props = Omit<HTMLElementProps<HTMLImageElement>, "src">;

const FayrLogo = (props: Props) => (
    <img
        alt="fayrtv-logo"
        {...props}
        src="https://fayr-logo-v001.s3.eu-central-1.amazonaws.com/svg/fayr_logo_main.svg"
    />
);

export default FayrLogo;
