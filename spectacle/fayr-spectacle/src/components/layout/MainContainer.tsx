import { ComponentProps, PropsWithChildren } from "react";
import useIsMobile from "~/hooks/useIsMobile";
import { Box, Container } from "@mantine/core";
import { Crumbs } from "~/components/Crumbs";

type Props = PropsWithChildren<{
    crumbs?: ComponentProps<typeof Crumbs>["items"];
}>;

export default function MainContainer({ children, crumbs }: Props) {
    const isMobile = useIsMobile();

    return (
        <Box
            sx={{
                padding: isMobile ? "10px" : "50px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            {crumbs && <Crumbs items={crumbs} />}
            {children}
        </Box>
    );
}
