import { ComponentProps, PropsWithChildren } from "react";
import { Box, createStyles } from "@mantine/core";
import { Crumbs } from "~/components/Crumbs";

type Props = PropsWithChildren<{
    crumbs?: ComponentProps<typeof Crumbs>["items"];
}>;

const useStyles = createStyles((theme) => ({
    root: {
        padding: theme.spacing.sm,
        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            padding: theme.spacing.md,
        },
        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            padding: theme.spacing.lg,
        },
        maxWidth: "100%",
        width: "100%",
    },
}));

export default function MainContainer({ children, crumbs }: Props) {
    const { classes } = useStyles();

    return (
        <Box className={classes.root} sx={{}}>
            {crumbs && <Crumbs items={crumbs} />}
            {children}
        </Box>
    );
}
