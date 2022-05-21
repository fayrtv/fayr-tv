import { Image } from "@mantine/core";
import React from "react";

type Props = Omit<React.ComponentProps<typeof Image>, "size" | "alt"> & {
    size?: number;
};

export default function ZeissLogo({ size = 80, ...props }: Props) {
    return <Image src={"/assets/zeiss_logo.svg"} alt="ZEISS Logo" width={size} {...props} />;
}
