import DesignerLayout from "components/layout/DesignerLayout";
import { NextSeo } from "next-seo";
import React from "react";

const Home = () => (
    <>
        <div className="bg-gray-100 dark:bg-transparent">
            <div className="container mx-auto flex flex-col items-center py-12 sm:py-24"></div>
        </div>

        <NextSeo title="Configurator" />
    </>
);

export default Home;

Home.layoutProps = {
    Layout: DesignerLayout,
};
