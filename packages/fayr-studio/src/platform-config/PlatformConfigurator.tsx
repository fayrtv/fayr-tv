import SettingsScreen from "./SettingsScreen";
import { isFalsyOrWhitespace } from "@fayr/shared-components";
import VerticalSteps, { StepInfo } from "components/VerticalSteps";
import IVPDesigner from "components/designer/IVPDesigner";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import PublishScreen from "platform-config/PublishScreen";
import StreamSettings from "platform-config/StreamSettings";
import { formatPlatformType } from "platform-config/platform-type/PlatformType";
import { PlatformTypeChoice } from "platform-config/platform-type/PlatformTypeChoice";
import React from "react";

const ZERO_WIDTH_NON_JOINER = "‌";

const PlatformConfigurator: React.FC = () => {
    const { type, info } = React.useContext(PlatformConfiguratorContext);

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
                description: "Some essentials...",
                href: "#",
                renderBody: () => <SettingsScreen />,
                isComplete:
                    !isFalsyOrWhitespace(info.name) && !isFalsyOrWhitespace(info.welcomeMessage),
            },
            {
                id: "3",
                name: "Design",
                description: "Time to create your own design",
                href: "#",
                renderBody: () => <IVPDesigner />,
                isComplete: false,
            },
            {
                id: "4",
                name: "Generate Streaming Keys or Add Videos",
                description: "Almost there...",
                href: "#",
                renderBody: () => <StreamSettings />,
                isComplete: false,
            },
            {
                id: "5",
                name: "Launch",
                description: "Let's deploy your app",
                href: "#",
                renderBody: () => <PublishScreen />,
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
