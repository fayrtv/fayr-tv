import { CollectionIcon, UserGroupIcon, VariableIcon } from "@heroicons/react/outline";
import Banner from "components/Banner";
import ColumnCards, { Card } from "components/ColumnCards";
import VerticalSteps from "components/VerticalSteps";
import React, { FunctionComponent } from "react";

interface OwnProps {}

type Props = OwnProps;

const cards: Card[] = [
    {
        key: "watch-party",
        title: "Watch Party",
        icon: UserGroupIcon,
        description: (
            <div className="flex-col space-y-4">
                <p>Streaming together is better</p>
                <p>Interactivity tools to keep your audience engaged</p>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
        ),
        ctaPrimary: "Choose",
    },
    {
        key: "vod",
        title: "Video-on-Demand",
        icon: CollectionIcon,
        description: (
            <div className="flex-col space-y-4">
                <p>Provide your audience with exclusive access to your video content</p>
                <p>Create your own streaming portal, akin to YouTube or Netflix</p>
            </div>
        ),
        ctaPrimary: "Choose",
    },
    {
        key: "hybrid",
        title: "Hybrid",
        icon: VariableIcon,
        description: (
            <div className="flex-col space-y-4">
                <p>Combine the best of Watch Party and VoD</p>
                <p>Perfect choice for hybrid events (?) or online learning platforms</p>
            </div>
        ),
        ctaPrimary: "Choose",
    },
];
const Home: FunctionComponent<Props> = () => {
    const [currentStepId, setCurrentStepId] = React.useState<string>("1");
    return (
        <>
            <Banner />
            <div className="p-12">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-neutral">
                        Let's get started
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-neutral">
                        <p>Complete these steps to get your streaming platform up and running.</p>
                    </div>
                </div>
            </div>
            <VerticalSteps
                currentStepId={currentStepId}
                setCurrentStepId={setCurrentStepId}
                steps={[
                    {
                        id: "1",
                        name: "Choose your Streaming Platform",
                        description: "Do what you have to",
                        href: "#",
                        renderBody: () => <ColumnCards cards={cards} />,
                    },
                    {
                        id: "2",
                        name: "Basic Setup",
                        description: "This is important",
                        href: "#",
                    },
                    {
                        id: "3",
                        name: "Design",
                        description: "Damn, we got so far",
                        href: "#",
                    },
                    {
                        id: "4",
                        name: "Generate Streaming Keys or Add Videos",
                        description: "Almost there...",
                        href: "#",
                    },
                    {
                        id: "5",
                        name: "Launch",
                        description: "Omfg let's deploy this maddafaka",
                        href: "#",
                    },
                ]}
            />
        </>
    );
};

export default Home;
