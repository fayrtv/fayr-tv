import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
    value?: string;
    onChange?: (value: string) => void | Dispatch<SetStateAction<string>>;
    isValid?: boolean;
    errorMessage?: string;
} & Omit<React.HTMLAttributes<HTMLInputElement>, "type" | "onChange">;

export default function TextField({
    className,
    value,
    onChange,
    errorMessage,
    isValid = true,
    ...props
}: Props) {
    return (
        <>
            <input
                type="text"
                value={value}
                onChange={(ev) => onChange(ev.target.value)}
                className={classNames(
                    "bg-transparent text-neutral border-neutral focus:ring focus:border-neutral focus:ring-neutral focus:ring-1 focus:ring-opacity-20",
                    className,
                )}
                {...props}
            />
            {/*{isValid ? null : <span className="pos-absolute h-12 w-12 p-2 bg-green">✅</span>}*/}
        </>
    );
}
