import { layoutFactory } from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";
import React from "react";

const ProfilePage: NextPageWithLayout = () => {
    return <div></div>;
};

ProfilePage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default ProfilePage;
