// Framework
import * as React from "react";

export const useGlobalClickHandler = (callback: ((event: MouseEvent) => void) | ((event: MouseEvent) => Promise<void>), additionalDependencies: Array<unknown> = []) => {

	React.useEffect(() => {
		document.body.addEventListener('click', callback);

		return () => document.body.removeEventListener('click', callback);
	}, [callback, ...additionalDependencies]);
}

export default useGlobalClickHandler;