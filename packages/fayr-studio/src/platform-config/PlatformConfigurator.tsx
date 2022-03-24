import SettingsScreen from "./SettingsScreen";
import VerticalSteps, { StepInfo } from "components/VerticalSteps";
import Designer from "components/designer/Designer";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import { formatPlatformType } from "platform-config/platform-type/PlatformType";
import { PlatformTypeChoice } from "platform-config/platform-type/PlatformTypeChoice";
import React from "react";

const ZERO_WIDTH_NON_JOINER = "‌";

const PlatformConfigurator: React.FC = () => {
    const { type } = React.useContext(PlatformConfiguratorContext);

    const [currentStepId, setCurrentStepId] = React.useState("choose-platform");

    const steps: StepInfo[] = React.useMemo(
        () => [
            {
                id: "choose-platform",
                name: "Choose your Streaming Platform",
                description: type !== undefined ? formatPlatformType(type) : ZERO_WIDTH_NON_JOINER,
                href: "#",
                renderBody: () => <PlatformTypeChoice />,
                isComplete: type !== undefined,
            },
            {
                id: "2",
                name: "Basic Setup",
                description: "This is important",
                href: "#",
                renderBody: () => <SettingsScreen />,
                isComplete: false,
            },
            {
                id: "3",
                name: "Design",
                description: "Damn, we got so far",
                href: "#",
                renderBody: () => <Designer />,
                isComplete: false,
            },
            {
                id: "4",
                name: "Generate Streaming Keys or Add Videos",
                description: "Almost there...",
                href: "#",
                isComplete: false,
            },
            {
                id: "5",
                name: "Launch",
                description: "Let's deploy this!",
                href: "#",
                isComplete: false,
            },
        ],
        [type],
    );

    return (
        <VerticalSteps
            currentStepId={currentStepId}
            setCurrentStepId={setCurrentStepId}
            steps={steps}
        />
    );
};

export default PlatformConfigurator;
