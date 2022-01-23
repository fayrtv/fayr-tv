import React from "react";
import styled from "styled-components";

type Props = {
    content?: string | JSX.Element;
    fullScreen?: boolean;
};

const CenteredFullScreen = styled.div`
    position: fixed;
    z-index: 999;
    height: 2em;
    width: 2em;
    overflow: unset;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    // Transparent Overlay
    :before {
        content: "";
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // TODO: Not the prettiest gradient. Feel free to improve
        background: radial-gradient(rgba(20, 20, 20, 0.6), rgba(0, 0, 0, 1));
    }
`;

export default function LoadingAnimation({ content = "Lade...", fullScreen = false }: Props) {
    return fullScreen ? (
        <CenteredFullScreen className="loading">{content}</CenteredFullScreen>
    ) : (
        <div className="flex justify-center items-center">
            <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
            >
                <span className="visually-hidden">{content}</span>
            </div>
        </div>
    );
}
