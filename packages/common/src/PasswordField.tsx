import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
    value?: string;
    onChange?: (value: string) => void | Dispatch<SetStateAction<string>>;
} & Omit<React.HTMLAttributes<HTMLInputElement>, "type" | "onChange">;

export default function PasswordField({ className, value, onChange, ...props }: Props) {
    return (
        <input
            type="password"
            value={value}
            onChange={(ev) => onChange(ev.target.value)}
            className={classNames(
                "bg-transparent text-neutral border-neutral focus:ring focus:border-neutral focus:ring-neutral focus:ring-1 focus:ring-opacity-20",
                className,
            )}
            {...props}
        />
    );
}
