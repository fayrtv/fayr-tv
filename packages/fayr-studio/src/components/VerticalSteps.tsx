import { CheckIcon } from "@heroicons/react/solid";
import React, { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

export type StepInfo = {
    id: string;
    name: string;
    description?: string;
    href: string;
    renderBody?: () => JSX.Element;
    isComplete: boolean;
};

type Props = {
    currentStepId: string;
    setCurrentStepId: Dispatch<SetStateAction<string>>;
    steps: StepInfo[];
};

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

function Bubble({ isComplete, isCurrent }: { isComplete: boolean; isCurrent: boolean }) {
    const dot = <span className="h-2.5 w-2.5 bg-neutral rounded-full" />;
    return (
        <>
            {isComplete ? (
                <span className="h-9 flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                        <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                    </span>
                </span>
            ) : isCurrent ? (
                <span className="h-9 flex items-center" aria-hidden="true">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-blueish border-2 border-primary rounded-full">
                        {dot}
                    </span>
                </span>
            ) : (
                <span className="h-9 flex items-center" aria-hidden="true">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-blueish border-2 border-neutral rounded-full group-hover:border-gray-400">
                        <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-blueish" />
                    </span>
                </span>
            )}
        </>
    );
}

function Text({ description, name }: Pick<StepInfo, "description" | "name">) {
    return (
        <>
            <span className="min-w-0 flex flex-col">
                <span className="text-lg tracking-wide font-upper text-primary hover:text-primary-light">
                    {name}
                </span>
                {description && <span className="text-md text-neutral">{description}</span>}
            </span>
        </>
    );
}

function ConnectorLine({ highlighted }: { highlighted: boolean }) {
    return (
        <div
            className={classNames(
                "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full ",
                highlighted ? "bg-primary" : "bg-neutral",
            )}
            aria-hidden="true"
        />
    );
}

export default function VerticalSteps({ currentStepId, setCurrentStepId, steps }: Props) {
    const isCurrentStep = (step: StepInfo) => step.id === currentStepId;

    return (
        <nav aria-label="Progress">
            <ol className="overflow-hidden">
                {steps.map((step, stepIdx) => (
                    <li
                        onClick={() => setCurrentStepId(step.id)}
                        key={step.name}
                        className={classNames(
                            stepIdx !== steps.length - 1 ? "pb-10" : "",
                            "relative",
                        )}
                    >
                        {stepIdx !== steps.length - 1 ? (
                            <ConnectorLine highlighted={step.isComplete} />
                        ) : null}

                        <div className="relative flex items-start group">
                            <Bubble isComplete={step.isComplete} isCurrent={isCurrentStep(step)} />
                            <div className="ml-4 w-full block flex-row">
                                <div
                                    className={classNames(
                                        "w-full block relative",
                                        currentStepId === step.id
                                            ? "bg-gradient-to-b from-background pb-8"
                                            : "",
                                    )}
                                >
                                    <Link to={step.href}>
                                        <Text name={step.name} description={step.description} />
                                    </Link>
                                </div>
                                <div className="w-full text-sm block relative bg-black">
                                    {isCurrentStep(step)
                                        ? step.renderBody !== undefined
                                            ? step.renderBody()
                                            : `Content of ${step.name}`
                                        : null}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
