import React from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
    additionalCondition?: boolean;
};

type ScreenSize = "mobile" | "largeScreens";

export const Desktop: React.FC<Props> = (props) => (
    <MediaQueryComponent {...props} query={useIsDesktop} />
);

export const Mobile: React.FC<Props> = (props) => (
    <MediaQueryComponent {...props} query={useIsMobile} />
);

export const TabletOrMobile: React.FC<Props> = (props) => (
    <MediaQueryComponent {...props} query={useIsTabletOrMobile} />
);

const MediaQueryComponent: React.FC<
    Props & {
        query(): boolean;
    }
> = ({ additionalCondition, children, query }) => (
    <>{query() && (additionalCondition ?? true) ? children : null}</>
);

export const useIsDesktop = () => useMediaQuery({ minWidth: getSizeFromCss("largeScreens") + 1 });

export const useIsTabletPortrait = () =>
    useMediaQuery({ minWidth: getSizeFromCss("mobile"), maxWidth: getSizeFromCss("largeScreens") });

export const useIsMobile = () => useMediaQuery({ maxWidth: getSizeFromCss("largeScreens") });

export const useIsMobilePortrait = () => useMediaQuery({ maxWidth: getSizeFromCss("mobile") });

export const useIsMobileLandscape = () =>
    useMediaQuery({ minWidth: getSizeFromCss("mobile"), maxWidth: 1224, maxHeight: 500 });

export const useIsTabletOrMobile = () => useMediaQuery({ maxWidth: 1224 });

const getSizeFromCss = (identifier: ScreenSize): number => {
    const styles = getComputedStyle(document.documentElement);
    const cssVariable = styles.getPropertyValue(`--${identifier}`);

    return +cssVariable.trim().replace("px", "");
};
