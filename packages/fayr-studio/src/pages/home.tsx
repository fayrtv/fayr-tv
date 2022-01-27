import Banner from "components/Banner";
import FayrStudioLayout from "components/layout/FayrStudioLayout";
import { NextSeo } from "next-seo";
import PlatformConfigurator from "platform-config/PlatformConfigurator";
import PlatformConfiguratorContextProvider from "platform-config/PlatformConfiguratorContextProvider";
import React from "react";

const Home = () => {
    return (
        <>
            <NextSeo title="Home" />
            <Banner />
            <div className="p-12">
                <div className="text-lg leading-6 font-medium text-neutral">Let's get started</div>
                <span className="text-sm">
                    Complete these steps to get your streaming platform up and running.
                </span>
            </div>
            <PlatformConfiguratorContextProvider>
                <PlatformConfigurator />
            </PlatformConfiguratorContextProvider>
        </>
    );
};

export default Home;

Home.layoutProps = {
    Layout: FayrStudioLayout,
};
