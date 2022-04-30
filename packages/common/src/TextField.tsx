import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";

import useValidation from "./hooks/useValidation";
import { isFalsyOrWhitespace } from "./utils/stringUtils";

type Props = {
    type?: "text" | "password";
    value?: string;
    onChange?: (value: string) => void | Dispatch<SetStateAction<string>>;
    getErrorMessage?: (currentValue: string) => undefined | null | string;
} & Omit<React.HTMLAttributes<HTMLInputElement>, "type" | "onChange">;

export default function TextField({
    type = "text",
    className,
    value,
    onChange,
    getErrorMessage,
    ...props
}: Props) {
    const { validateOnBlur, shouldShowValidationResult, isValid, errorMessage } = useValidation(
        value,
        getErrorMessage,
        isFalsyOrWhitespace,
    );

    return (
        <div className="flex flex-row border border-neutral items-baseline">
            <input
                type={type}
                value={value}
                onChange={(ev) => onChange(ev.target.value)}
                onBlur={validateOnBlur}
                className={classNames(
                    "-mr-2 w-full bg-transparent text-neutral border-none focus:ring focus:border-neutral focus:ring-neutral focus:ring-0",
                    className,
                )}
                {...props}
            />
            {shouldShowValidationResult ? (
                isValid ? (
                    <span className="pr-2">✅</span>
                ) : (
                    <div>
                        <span className="pr-2">❌</span>
                        <span className="">{errorMessage}</span>
                    </div>
                )
            ) : null}
        </div>
    );
}
