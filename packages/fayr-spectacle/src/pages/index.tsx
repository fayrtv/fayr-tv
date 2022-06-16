import Layout, { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React, { ComponentProps, ReactChild } from "react";

/**
 * Note that App.tsx redirects the user to a different page.
 */
const IndexPage: NextPageWithLayout = () => {
    return <div></div>;
};

IndexPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: true,
            props: {
                showAppointmentCTA: false,
            },
        },
    }),
};

export default IndexPage;
