/**
 * SENSITIVE, CLIENT-SIDE-ONLY DATA
 */
export type RefractionProtocol = {
    left: SideConfiguration;
    right: SideConfiguration;
};

export type SideConfiguration = {
    sphere: number;
    cylinder: number;
    axis: number;
    addition?: number;
    pd: number;
    prisma?: number;
    basis?: number;

    [key: string]: any;
};
