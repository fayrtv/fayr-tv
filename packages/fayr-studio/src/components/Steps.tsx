import React from "react";

const steps = [
    { id: "Schritt 1", name: "Welcome Screen", href: "#", status: "complete" },
    { id: "Schritt 2", name: "Video Player", href: "#", status: "current" },
];

export default function Steps() {
    return (
        <nav aria-label="Progress">
            <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                {steps.map((step) => (
                    <li key={step.name} className="md:flex-1">
                        {step.status === "complete" ? (
                            <a
                                href={step.href}
                                className="group pl-4 py-2 flex flex-col border-l-4 border-neutral-600 hover:border-primary md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                            >
                                <span className="text-xs text-neutral font-semibold tracking-wide uppercase group-hover:text-primary-800">
                                    {step.id}
                                </span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        ) : step.status === "current" ? (
                            <a
                                href={step.href}
                                className="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                                aria-current="step"
                            >
                                <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
                                    {step.id}
                                </span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        ) : (
                            <a
                                href={step.href}
                                className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                            >
                                <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                                    {step.id}
                                </span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </a>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
