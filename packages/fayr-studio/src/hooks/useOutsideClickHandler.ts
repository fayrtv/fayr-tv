import { RefObject, useEffect } from "react";

const useOutsideClickHandler = (
    handler: (event: MouseEvent) => void,
    ...refs: RefObject<any>[]
) => {
    useEffect(() => {
        let startedInside: any = false;
        let startedWhenMounted = false;

        const listener = (event: MouseEvent) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted) {
                return;
            }

            // Do nothing if clicking refs' elements or descendants
            for (const ref of refs) {
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
            }

            handler(event);
        };

        const validateEventStart = (event: MouseEvent | TouchEvent) => {
            startedWhenMounted = true;
            startedInside = refs.find((ref) => ref.current && ref.current.contains(event.target));
        };

        document.addEventListener("mousedown", validateEventStart);
        document.addEventListener("touchstart", validateEventStart);
        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("mousedown", validateEventStart);
            document.removeEventListener("touchstart", validateEventStart);
            document.removeEventListener("click", listener);
        };
    }, [refs, handler]);
};

export default useOutsideClickHandler;
