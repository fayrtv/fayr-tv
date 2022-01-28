export type Nullable<T> = T | null;

export type CouldBePartial<T> = T | Partial<T>;

export type PartialBut<TType, TRequired extends keyof TType> = Partial<TType> &
    Pick<TType, TRequired>;

export type Callback<T> = (payload: T) => void;
