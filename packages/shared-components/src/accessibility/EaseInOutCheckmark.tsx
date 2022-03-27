import * as React from "react";
import styled from "styled-components";

import MaterialIcon from "../MaterialIcon";

type Props = Omit<React.ComponentProps<typeof MaterialIcon>, "iconName">;

const StyledMaterialIcon = styled(MaterialIcon)`
    animation: pulse 1s infinite;

    @keyframes pulse {
        0% {
            opacity: 0;
        }

        20% {
            opacity: 1;
        }

        80% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }
`;

export const PulsatingCheckmark = (props: Props) => {
    return <StyledMaterialIcon {...props} iconName="check" />;
};

export default PulsatingCheckmark;
