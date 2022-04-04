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
        <div className="divide-y divide-gray pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5 divide-y divide-gray">
                <RadioGroup value={selected} onChange={onChange}>
                    <RadioGroup.Label className="text-sm font-medium text-neutral">
                        <h3 className="text-lg leading-6 font-medium text-neutral">{label}</h3>
                    </RadioGroup.Label>

                    <div className="mt-2 bg-blueish inline-block rounded-md shadow-sm -space-y-px">
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
                                            ? "bg-background border-neutral z-10"
                                            : "border-neutral",
                                        "relative border p-4 flex cursor-pointer focus:outline-none",
                                    )
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                checked
                                                    ? "bg-blueish border-primary"
                                                    : "bg-blueish border-primary",
                                                "h-5 w-5 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center",
                                            )}
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={classNames(
                                                    "rounded-full w-2 h-2",
                                                    checked ? "bg-white" : "bg-transparent",
                                                )}
                                            />
                                        </span>
                                        <div className="ml-3 flex flex-col">
                                            <RadioGroup.Label
                                                as="span"
                                                className={classNames(
                                                    checked ? "text-primary" : "text-neutral",
                                                    "block text-sm font-medium",
                                                )}
                                            >
                                                {setting.name}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                                as="span"
                                                className={classNames(
                                                    checked ? "text-secondary" : "text-secondary",
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
