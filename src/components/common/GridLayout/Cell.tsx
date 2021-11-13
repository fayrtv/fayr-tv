// Framework
import * as React from "react";

import "./styles/Grid.scss";
import "./styles/Cell.scss";

type CellStyleKeys = "gridColumn" | "gridRow" | "gridArea";

type CellStyles = Pick<React.CSSProperties, CellStyleKeys>;

type CellProps = {
    className?: string;
    gridArea?: string;
    cellStyles?: CellStyles;

    children?: React.ReactNode;
    onClick?: () => void;
    ref?: React.Ref<any>;
};

export const Cell: React.FC<CellProps> = ({
    className,
    cellStyles,
    gridArea,
    children,
    onClick,
    ref,
}) => {
    const styles: React.CSSProperties = {
        ...cellStyles,
        height: "100%",
        width: "100%",
    };

    if (gridArea) {
        styles.gridArea = gridArea;
    }

    return (
        <div className={className} style={styles} onClick={onClick} ref={ref}>
            {children}
        </div>
    );
};

export default Cell;
