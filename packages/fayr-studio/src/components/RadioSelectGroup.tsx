import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import React from "react";

export type RadioSelectItem = { id: string; name: string; description: string };

type Props = {
    label: string | JSX.Element;
    items: RadioSelectItem[];
    selected: string;
    onChange: (selectedId: string) => void;
};
const RadioSelectGroup = ({ label, items, selected, onChange }: Props) => {
    return (
        <div className="divide-y divide-gray-200 pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5 divide-y divide-gray-200">
                <RadioGroup value={selected} onChange={onChange}>
                    <RadioGroup.Label className="text-sm font-medium text-gray-900">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{label}</h3>
                    </RadioGroup.Label>

                    <div className="mt-1 bg-white rounded-md shadow-sm -space-y-px">
                        {items.map((setting, settingIdx) => (
                            <RadioGroup.Option
                                key={setting.name}
                                value={setting}
                                className={({ checked }) =>
                                    classNames(
                                        settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                                        settingIdx === items.length - 1
                                            ? "rounded-bl-md rounded-br-md"
                                            : "",
                                        checked
                                            ? "bg-sky-50 border-sky-200 z-10"
                                            : "border-gray-200",
                                        "relative border p-4 flex cursor-pointer focus:outline-none",
                                    )
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                checked
                                                    ? "bg-sky-600 border-transparent"
                                                    : "bg-white border-gray-300",
                                                active ? "ring-2 ring-offset-2 ring-sky-500" : "",
                                                "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center",
                                            )}
                                            aria-hidden="true"
                                        >
                                            <span className="rounded-full bg-white w-1.5 h-1.5" />
                                        </span>
                                        <div className="ml-3 flex flex-col">
                                            <RadioGroup.Label
                                                as="span"
                                                className={classNames(
                                                    checked ? "text-sky-900" : "text-gray-900",
                                                    "block text-sm font-medium",
                                                )}
                                            >
                                                {setting.name}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                                as="span"
                                                className={classNames(
                                                    checked ? "text-sky-700" : "text-gray-500",
                                                    "block text-sm",
                                                )}
                                            >
                                                {setting.description}
                                            </RadioGroup.Description>
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
};

export default RadioSelectGroup;
