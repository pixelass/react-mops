import React from "react";
import {useEventListener, useEventListeners} from "./event-listener";
import {useDocument, useWindow} from "./globals";

enum KEYS {
	Alt = "Alt",
	Shift = "Shift",
	Meta = "Meta",
	Control = "Control"
}

export const useKey = key => {
	const [isActive, setActive] = React.useState(false);
	const win = useWindow();
	const doc = useDocument();
	useEventListener(
		"keydown",
		(event: KeyboardEvent) => {
			if (event.key === key) {
				setActive(true);
			}
		},
		doc,
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
		doc,
		[setActive, key]
	);

	// Deactivate on window blur and focus
	useEventListeners(
		["focus", "blur"],
		() => {
			setActive(false);
		},
		win,
		[setActive]
	);
	return isActive;
};

export const useMeta = () => useKey(KEYS.Meta);

export const useControl = () => useKey(KEYS.Control);

export const useShift = () => useKey(KEYS.Shift);

export const useAlt = () => useKey(KEYS.Alt);
