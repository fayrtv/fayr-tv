import React from "react";

type WithCraftStatics<C extends React.ComponentType> = {
    craft: {
        props: React.ComponentProps<C>;
        related: {
            settings: React.ComponentType<any>;
        };
    };
};

export function withCraft<C extends (props: P) => JSX.Element, P>(
    component: C,
): C & WithCraftStatics<C> {
    return component as unknown as C & WithCraftStatics<C>;
}
