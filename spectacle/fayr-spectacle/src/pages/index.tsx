import Layout, { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React, { ComponentProps, ReactChild } from "react";
import { SwitchAvailability } from "~/components/layout/SubHeader";

const SitemapPage: NextPageWithLayout = () => {
    return <div></div>;
};

SitemapPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: true,
            props: {
                showAppointmentCTA: false,
                switchAvailability: SwitchAvailability.CustomerOnly,
            },
        },
    }),
};

export default SitemapPage;
