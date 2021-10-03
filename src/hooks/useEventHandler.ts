// Framework
import * as React from "react";

export const useEventHandler = <TEvent extends Event>(eventKey: string, handler: (event: TEvent) => void, element: HTMLElement | Document = document) => {
	React.useEffect(() => {
		const typedHandler = (event: Event) => handler(event as TEvent)

		element.addEventListener(eventKey, typedHandler);

		return () => element.removeEventListener(eventKey, typedHandler);
	})
}

export default useEventHandler;