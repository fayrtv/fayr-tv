import { MaterialIcon } from "@fayr/shared-components";
import React from "react";
import tw from "twin.macro";

type Props = {
    iconProps: React.ComponentProps<typeof MaterialIcon>;
};

export const navMenuIconActionButtonStyle = tw`flex justify-center p-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;

export default function NavMenuIconActionButton({ iconProps }: Props) {
    return (
        <div style={navMenuIconActionButtonStyle} className="bg-gray text-neutral">
            <MaterialIcon {...iconProps} color="white" />
        </div>
    );
}
