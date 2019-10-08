import React from "react";

export const useEventListener = (type, listener, context, dependencies) => {
	React.useEffect(() => {
		context.addEventListener(type, listener);
		return () => {
			context.removeEventListener(type, listener);
		};
	}, [type, listener, context, ...dependencies]);
};

export const useEventListeners = (types, listener, context, dependencies) => {
	React.useEffect(() => {
		types.map(type => context.addEventListener(type, listener));
		return () => {
			types.map(type => context.removeEventListener(type, listener));
		};
	}, [types, listener, context, ...dependencies]);
};
