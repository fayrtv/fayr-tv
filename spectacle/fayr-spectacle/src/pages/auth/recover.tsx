import React from "react";
import Layout, {layoutFactory} from "~/components/layout/Layout";
import { NextPageWithLayout } from "~/types/next-types";

const RecoverPage: NextPageWithLayout = () => {
    return <>TODO: Forgot password page</>;
};

RecoverPage.layoutProps = {
    Layout: layoutFactory({
        subHeader: {
            enabled: false,
        },
    }),
};

export default RecoverPage;
