import classNames from "classnames";
import React from "react";

type Props = { value?: string; disabled?: boolean } & Omit<
    React.HTMLAttributes<HTMLInputElement>,
    "type"
>;

export default function SubmitButton({ disabled = false, className, ...props }: Props) {
    return (
        <input
            type="submit"
            className={classNames(
                "text-black border-neutral font-semibold p-2 focus:ring focus:border-neutral focus:ring-neutral focus:ring-1 focus:ring-opacity-20",
                { "bg-primary-dark": disabled, "bg-primary cursor-pointer": !disabled },
                className,
            )}
            disabled={disabled}
            {...props}
        />
    );
}
