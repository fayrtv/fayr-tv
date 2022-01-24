import { CollectionIcon, UserGroupIcon, VariableIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import ColumnCards from "components/ColumnCards";
import { PlatformConfiguratorContext } from "platform-config/PlatformConfiguratorContextProvider";
import { formatPlatformType, PlatformType } from "platform-config/platform-type/PlatformType";
import React from "react";

export function PlatformTypeChoice() {
    const { type, setType } = React.useContext(PlatformConfiguratorContext);

    const checkedIcon = <CheckCircleIcon className="w-5 h-5" />;

    return (
        <ColumnCards
            cards={[
                {
                    key: "watch-party",
                    title: formatPlatformType(PlatformType.WatchParty),
                    icon: UserGroupIcon,
                    description: (
                        <ul className="flex-col space-y-4">
                            <li>Streaming together is better</li>
                            <li>Interactivity tools to keep your audience engaged</li>
                            <li>Lorem ipsum dolor sit amet</li>
                        </ul>
                    ),
                    ctaPrimary: type === PlatformType.WatchParty ? checkedIcon : "Choose",
                    onCtaPrimaryClicked: () => setType(PlatformType.WatchParty),
                },
                {
                    key: "vod",
                    title: formatPlatformType(PlatformType.VideoOnDemand),
                    icon: CollectionIcon,
                    description: (
                        <ul className="flex-col space-y-4">
                            <li>
                                Provide your audience with exclusive access to your video content
                            </li>
                            <li>Create your own streaming portal, akin to YouTube or Netflix</li>
                        </ul>
                    ),
                    ctaPrimary: type === PlatformType.VideoOnDemand ? checkedIcon : "Choose",
                    onCtaPrimaryClicked: () => setType(PlatformType.VideoOnDemand),
                },
                {
                    key: "hybrid",
                    title: formatPlatformType(PlatformType.Hybrid),
                    icon: VariableIcon,
                    description: (
                        <ul className="flex-col space-y-4">
                            <li>Combine the best of Watch Party and VoD</li>
                            <li>
                                Perfect choice for hybrid events (?) or online learning platforms
                            </li>
                        </ul>
                    ),
                    ctaPrimary: type === PlatformType.Hybrid ? checkedIcon : "Choose",
                    onCtaPrimaryClicked: () => setType(PlatformType.Hybrid),
                },
            ]}
        />
    );
}
