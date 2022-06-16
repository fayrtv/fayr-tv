import React from "react";

export const DataGridCell = ({children, area}: { children: React.ReactNode; area: string }) => (
    <div style={{height: "100%", width: "100%", gridArea: area}}>{children}</div>
);
