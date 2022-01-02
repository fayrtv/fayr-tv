import { MaterialIcon } from "@fayr/shared-components";
import React from "react";

type Props = {
    iconProps: React.ComponentProps<typeof MaterialIcon>;
};

export default function NavMenuIconActionButton({ iconProps }: Props) {
    return (
        <div className="bg-gray text-neutral flex justify-center p-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <MaterialIcon {...iconProps} color="white" />
        </div>
    );
}
