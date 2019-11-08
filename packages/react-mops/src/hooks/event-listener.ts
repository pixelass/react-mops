import React from "react";

type Context = Window | Document | null;
type UseEventListener = (
	type: string,
	listener: EventListener,
	context: Context,
	dependencies: any[]
) => void;
type UseEventListeners = (
	type: string[],
	listener: EventListener,
	context: Context,
	dependencies: any[]
) => void;

export const useEventListener: UseEventListener = (type, listener, context, dependencies) => {
	React.useEffect(() => {
		if (context !== null) {
			context.addEventListener(type, listener, {passive: true, capture: false});
		}
		return () => {
			if (context !== null) {
				context.removeEventListener(type, listener);
			}
		};
	}, [type, listener, context, ...dependencies]);
};

export const useEventListeners: UseEventListeners = (types, listener, context, dependencies) => {
	React.useEffect(() => {
		if (context !== null) {
			types.map(type =>
				context.addEventListener(type, listener, {passive: true, capture: false})
			);
		}
		return () => {
			if (context !== null) {
				types.map(type => context.removeEventListener(type, listener));
			}
		};
	}, [types, listener, context, ...dependencies]);
};
