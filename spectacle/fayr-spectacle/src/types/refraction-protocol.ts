/**
 * SENSITIVE, CLIENT-SIDE-ONLY DATA
 */
export type RefractionProtocol = {
    left: SideConfiguration;
    right: SideConfiguration;
};

type SideConfiguration = {
    sphere: number;
    cylinder: number;
    axis: number;
    addition?: number;
    pd: number;
};
