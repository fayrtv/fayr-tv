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
    // TODO: Remove, as it's already contained in the database model (which has `data: RefractionProtocol`)
    date: Date;
};
