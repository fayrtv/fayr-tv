import { ClassAttributes, HTMLAttributes } from "react";

export type HTMLElementProps<T> = ClassAttributes<T> & HTMLAttributes<T>;
