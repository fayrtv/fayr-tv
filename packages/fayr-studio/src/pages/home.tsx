// @ts-ignore
import styles from "./home.module.scss";
import classNames from "classnames";
import { A } from "components/A";
import FayrStudioLayout from "components/layout/FayrStudioLayout";
import { NextSeo } from "next-seo";
import React from "react";

const ROTATING_TEXTS = [
    "Streaming Platforms",
    "Interactive Video Players",
    "Video-on-Demand Platforms",
];
const ROTATION_INTERVAL_MS = 4000;

const Home = () => {
    const [displayedTextIndex, setDisplayedTextIndex] = React.useState(0);

    React.useEffect(() => {
        const handle = window.setInterval(() => {
            setDisplayedTextIndex((current) => (current + 1) % ROTATING_TEXTS.length);
        }, ROTATION_INTERVAL_MS);
        return () => window.clearInterval(handle);
    }, []);

    const displayedText = ROTATING_TEXTS[displayedTextIndex];

    return (
        <>
            <div className="bg-gray-100 dark:bg-transparent">
                <div className="container mx-auto flex flex-col items-center py-12 sm:py-24">
                    <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col mb-5 sm:mb-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-white font-black">
                            Create
                            <br />
                            <div
                                className={classNames(styles.henlo)}
                                style={{ display: "inline-block" }}
                            >
                                <span className="text-primary">{displayedText}</span>
                            </div>
                            <br />
                            that viewers love!
                        </h1>
                        <p className="mt-5 sm:mt-10 lg:w-10/12 text-neutral font-normal text-center text-sm sm:text-lg">
                            Create your own All-in-one-platform
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <A
                            href="/configurator"
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary transition duration-150 ease-in-out hover:bg-primary lg:text-xl lg:font-bold  rounded text-white px-4 sm:px-10 border border-primary py-2 sm:py-4 text-sm"
                        >
                            Get Started
                        </A>
                        <A
                            href="https://fayr.tv"
                            className="ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-transparent transition duration-150 ease-in-out hover:border-primary lg:text-xl lg:font-bold  hover:text-primary rounded border border-primary text-primary px-4 sm:px-10 py-2 sm:py-4 text-sm"
                        >
                            Live Demo
                        </A>
                    </div>
                </div>
            </div>

            <NextSeo title="Configurator" />
        </>
    );
};

export default Home;

Home.layoutProps = {
    Layout: FayrStudioLayout,
};
