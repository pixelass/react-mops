import React from "react";
import {useEventListener, useEventListeners} from "./event-listener";

export const usePointer = ({onMouseMove, onMouseUp, onTouchEnd, onTouchMove}) => {
	const [isDown, setDown] = React.useState<boolean>(false);

	if ("window" in global) {
		useEventListener(
			"mousemove",
			(event: MouseEvent) => {
				if (isDown) {
					onMouseMove(event);
				}
			},
			document,
			[isDown, onMouseMove]
		);

		useEventListener(
			"touchmove",
			(event: TouchEvent) => {
				if (isDown) {
					onTouchMove(event);
				}
			},
			document,
			[isDown, onTouchMove]
		);

		// Deactivate on mouseup
		useEventListener(
			"mouseup",
			(event: MouseEvent) => {
				if (isDown) {
					setDown(false);
					onMouseUp(event);
				}
			},
			document,
			[isDown, setDown, onMouseUp]
		);

		// Deactivate on touchend
		useEventListener(
			"touchend",
			(event: TouchEvent) => {
				if (isDown) {
					setDown(false);
					onTouchEnd(event);
				}
			},
			document,
			[isDown, setDown, onTouchEnd]
		);

		// Deactivate on window blur and focus
		useEventListeners(
			["focus", "blur"],
			() => {
				setDown(false);
			},
			window,
			[setDown]
		);

		return setDown as React.Dispatch<React.SetStateAction<boolean>>;
	}
	return (() => undefined) as React.Dispatch<React.SetStateAction<boolean>>;
};
