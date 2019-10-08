import React from "react";
import {useEventListener, useEventListeners} from "./event-listener";

enum KEYS {
	Alt = "Alt",
	Shift = "Shift",
	Meta = "Meta",
	Control = "Control"
}

export const useKey = key => {
	const [isActive, setActive] = React.useState(false);
	if ("window" in global) {
		// Activate on keydown
		useEventListener(
			"keydown",
			(event: KeyboardEvent) => {
				if (event.key === key) {
					setActive(true);
				}
			},
			document,
			[setActive, key]
		);

		// Deactivate on keyup
		useEventListener(
			"keyup",
			(event: KeyboardEvent) => {
				if (event.key === key) {
					setActive(false);
				}
			},
			document,
			[setActive, key]
		);

		// Deactivate on window blur and focus
		useEventListeners(
			["focus", "blur"],
			() => {
				setActive(false);
			},
			window,
			[setActive]
		);

		return isActive;
	}
	return false;
};

export const useMeta = () => useKey(KEYS.Meta);

export const useControl = () => useKey(KEYS.Control);

export const useShift = () => useKey(KEYS.Shift);

export const useAlt = () => useKey(KEYS.Alt);
