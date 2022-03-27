import { Property as CssProperty } from "csstype";
import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    display: grid;
`;

const Dash = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 1;
    place-self: center;
    transform: rotate(-45deg);
    padding-left: 1px;
    padding-right: 1px;
    border-left: 1px solid black;
    border-right: 1px solid black;
`;

type Props = {
    fill?: CssProperty.Background;
    width?: CssProperty.Width;
    onClick?(): void;
};

export const DiagonalDash: React.FC<Props> = ({ children, fill = "white", width = 2, onClick }) => {
    const dashStyles: React.CSSProperties = {
        background: fill,
        width: typeof width === "number" ? `${width}px` : width,
    };

    const containerStyle: React.CSSProperties = {
        cursor: !!onClick ? "pointer" : "default",
    };

    return (
        <Container style={containerStyle} onClick={onClick ?? void 0}>
            {children}
            <Dash style={dashStyles} />
        </Container>
    );
};

export default DiagonalDash;
