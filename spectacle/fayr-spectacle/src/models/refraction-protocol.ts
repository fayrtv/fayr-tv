type SideConfiguration = {
    sphere: number;
    cylinder: number;
    axis: number;
    addition?: number;
    pd: number;
};

export type RefractionProtocol = {
    left: SideConfiguration;
    right: SideConfiguration;
    date: Date;
};
