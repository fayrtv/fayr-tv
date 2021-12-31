import { CheckIcon } from "@heroicons/react/solid";
import React from "react";
import { useRouteMatch } from "react-router-dom";

type Status = undefined | "complete" | "current";

type StepInfo = {
    id: string;
    name: string;
    description: string;
    href: string;
    renderBody?: () => JSX.Element;
};

type Props = {
    currentStepId: string;
    steps: StepInfo[];
};

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

function Bubble({ status }: { status: Status }) {
    const dot = <span className="h-2.5 w-2.5 bg-neutral rounded-full" />;
    return (
        <>
            {status === "complete" ? (
                <span className="h-9 flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                        <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                    </span>
                </span>
            ) : status === "current" ? (
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
                <span className="text-lg font-semibold tracking-wide uppercase text-primary">
                    {name}
                </span>
                <span className="text-sm text-neutral">{description}</span>
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

export default function VerticalSteps({ currentStepId, steps }: Props) {
    const stepsWithStatus = React.useMemo(() => {
        const result: (StepInfo & { status: Status })[] = [];
        let foundCurrent = false;
        for (const step of steps) {
            if (foundCurrent) {
                result.push({ ...step, status: undefined });
            } else if (step.id === currentStepId) {
                result.push({ ...step, status: "current" });
                foundCurrent = true;
            } else {
                result.push({ ...step, status: "complete" });
            }
        }
        return result;
    }, [currentStepId, steps]);

    const [expandedStepId, setExpandedStepId] = React.useState<string>(currentStepId);

    return (
        <nav aria-label="Progress">
            <ol className="overflow-hidden">
                {stepsWithStatus.map((step, stepIdx) => (
                    <li
                        key={step.name}
                        className={classNames(
                            stepIdx !== steps.length - 1 ? "pb-10" : "",
                            "relative",
                        )}
                    >
                        {stepIdx !== steps.length - 1 ? (
                            <ConnectorLine highlighted={step.status === "complete"} />
                        ) : null}

                        <div className="relative flex items-start group">
                            <Bubble status={step.status} />
                            <div className="ml-4 w-full block relative flex-row bg-background rounded-sm">
                                <a href={step.href}>
                                    <Text name={step.name} description={step.description} />
                                </a>

                                <div className="ml-8 my-8">
                                    {expandedStepId === step.id
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
