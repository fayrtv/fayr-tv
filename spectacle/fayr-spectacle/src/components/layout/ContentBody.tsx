import { PropsWithChildren } from "react";
import useIsMobile from "~/hooks/useIsMobile";
import { Box, Container } from "@mantine/core";

type Props = PropsWithChildren<{}>;

export default function ContentBody({ children }: Props) {
    const isMobile = useIsMobile();

    return (
        <Box
            sx={{
                padding: isMobile ? "10px" : "50px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            {children}
        </Box>
    );
}
