import useOutsideClickHandler from "hooks/useOutsideClickHandler";
import React from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

type Props = {
    name: string;
    color: string;
    onChange: (color: string) => void;
};

/**
 * https://codesandbox.io/s/opmco?file=/src/PopoverPicker.js
 */
export default function ColorPicker({ color, onChange, name }: Props) {
    const inputRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLInputElement>(null);

    const [isOpen, toggle] = React.useState(false);

    useOutsideClickHandler(() => toggle(false), popoverRef, inputRef);

    return (
        <div className="flex flex-row items-center mt-1">
            <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div
                    className="max-w-lg flex rounded-md shadow-sm"
                    onClick={() => toggle(true)}
                    ref={inputRef}
                >
                    <div
                        className="inline-flex items-center px-2 rounded-l-md bg-neutral border-2 border-r-0 border-white"
                        style={{
                            width: (inputRef.current?.clientHeight ?? 36) - 2,
                            backgroundColor: color,
                        }}
                    />
                    <div className="inline-block">
                        <HexColorInput
                            alpha
                            prefixed
                            type="text"
                            name={name}
                            id={name}
                            onClick={(ev) => {
                                toggle(true);
                                ev.preventDefault();
                            }}
                            color={color}
                            onChange={onChange}
                            className={`w-20 px-2 block text-black border-2 border-white rounded-none rounded-r-md sm:text-sm`}
                        />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="absolute"
                    ref={popoverRef}
                    style={{
                        left: 15 + (inputRef.current?.clientWidth ?? 0),
                    }}
                >
                    <HexColorPicker
                        onKeyDown={(ev) => {
                            if (ev.key === "Escape" || ev.key === "Tab") {
                                toggle(false);
                            }
                        }}
                        color={color}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
}
