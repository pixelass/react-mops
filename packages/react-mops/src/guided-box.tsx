import React from "react";
import {Box} from "./box";
import {GuidesConsumer} from "./guides";
import {Mops} from "./types";

export const GuidedBox: React.RefForwardingComponent<HTMLElement, Mops.BoxProps> = (
	{children, ...props},
	ref
) => {
	return (
		<GuidesConsumer>
			{context => (
				<Box {...props} {...context}>
					{children}
				</Box>
			)}
		</GuidesConsumer>
	);
};
