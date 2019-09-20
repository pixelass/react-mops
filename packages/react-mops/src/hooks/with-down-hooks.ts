import React from "react";
import {useMouseMove, useMouseMoveEvent} from "./mouse-event-hooks";

export const useWithDown = ({
	handleMouse,
	handleMouseEvent,
	scale,
	setAdditionalAngle,
	setInitialPosition,
	setInitialRotation,
	setPosition,
	setRotation
}) => {
	const [isDown, setDown] = useMouseMove(
		p => {
			const withSnapLogic = handleMouse(p);
			setPosition(withSnapLogic);
			setInitialPosition(withSnapLogic);
		},
		p => {
			const withSnapLogic = handleMouse(p);
			setPosition(withSnapLogic);
		},
		scale
	);

	const [isRotationDown, handleRotationDown] = useMouseMoveEvent(
		(event: MouseEvent) => {
			const d = handleMouseEvent(event);
			if (d) {
				setRotation(d.rotation);
				setInitialRotation(d.rotation);
			}
		},
		(event: MouseEvent) => {
			const d = handleMouseEvent(event);
			if (d) {
				setRotation(d.rotation);
			}
		},
		(event: React.MouseEvent<HTMLElement>) => {
			const d = handleMouseEvent(event, true);
			if (d) {
				setRotation(d.rotation);
				setInitialRotation(d.rotation);
				setAdditionalAngle({x: 0, y: 0, z: d.deg});
			}
		}
	);

	return {
		handleRotationDown,
		isDown,
		isRotationDown,
		setDown
	};
};
