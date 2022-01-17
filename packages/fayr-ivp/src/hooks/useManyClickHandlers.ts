import { debounce } from "lodash";
import React from "react";

// https://stackoverflow.com/questions/25777826/onclick-works-but-ondoubleclick-is-ignored-on-react-component
const useManyClickHandlers = (...handlers: Array<(e: React.MouseEvent<HTMLElement>) => void>) => {
    const callEventHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (e.detail <= 0) return;
        const handler = handlers[e.detail - 1];
        if (handler) {
            handler(e);
        }
    };

    const debounceHandler = debounce(function (e: React.MouseEvent<HTMLElement>) {
        callEventHandler(e);
    }, 250);

    return (e: React.MouseEvent<HTMLElement>) => {
        e.persist();
        debounceHandler(e);
    };
};

export default useManyClickHandlers;
