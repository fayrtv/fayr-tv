import React, { Dispatch, SetStateAction } from "react";

type Props = {
    checked: boolean;
    onChange: (newValue: boolean) => void | Dispatch<SetStateAction<boolean>>;
} & Omit<React.HTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked">;

export default function Checkbox({ className, checked, onChange, ...props }: Props) {
    return (
        <input
            className="form-check-input appearance-none h-4 w-4 border border-neutral bg-transparent checked:bg-primary focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain float-left cursor-pointer"
            type="checkbox"
            checked={checked}
            onChange={(ev) => onChange?.(ev.target.checked)}
            {...props}
        />
    );
}
