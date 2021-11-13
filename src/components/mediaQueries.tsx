import React from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
    additionalCondition?: boolean;
};

export const Desktop: React.FC<Props> = ({ children, additionalCondition }) => {
    const isDesktop = useMediaQuery({ minWidth: 961 });

    return <>{isDesktop && (additionalCondition ?? true) ? children : null}</>;
};

export const Tablet: React.FC<Props> = ({ children, additionalCondition }) => {
    const isTablet = useMediaQuery({ minWidth: 480, maxWidth: 960 });

    return <>{isTablet && (additionalCondition ?? true) ? children : null}</>;
};

export const Mobile: React.FC<Props> = ({ children, additionalCondition }) => {
    const isMobile = useMediaQuery({ maxWidth: 960 });

    return <>{isMobile && (additionalCondition ?? true) ? children : null}</>;
};

export const TabletOrMobile: React.FC<Props> = ({ children, additionalCondition }) => {
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

    return <>{isTabletOrMobile && (additionalCondition ?? true) ? children : null}</>;
};
