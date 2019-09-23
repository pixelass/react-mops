import React from "react";
import {Mops} from "../types";
import {coordinatesToDeg, degToRad, getBoundingBox, to360, withRotation} from "../utils";

/**
 * Mousemove hook
 * @param {Mops.MouseHandler} onMouseUp
 * @param {Mops.MouseHandler} onMouseMove
 * @param {number} scale
 * @param {React.RefObject<HTMLElement>} [contentRef]
 * @param {Mops.RotationModel} [rotation]
 */
export const useMouseMove = (
	onMouseUp: Mops.MouseHandler,
	onMouseMove: Mops.MouseHandler,
	scale: number,
	contentRef?: React.RefObject<HTMLElement>,
	rotation?: Mops.RotationModel
) => {
	const [isDown, setDown] = React.useState(false);
	const [initialPosition, setInitialPosition] = React.useState<Mops.PositionModel>({
		x: 0,
		y: 0
	});

	const handleMouseUp = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				setDown(false);
				onMouseUp(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		},
		[setDown, onMouseUp]
	);

	const handleMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				onMouseMove(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		},
		[onMouseMove]
	);

	React.useEffect(() => {
		document.addEventListener("mouseleave", handleMouseUp);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseUp]);

	React.useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	const handleDown = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
				event.preventDefault();
				setDown(true);
				setInitialPosition({x: event.clientX, y: event.clientY});
			}
		},
		[contentRef, setInitialPosition, setDown]
	);

	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
/**
 *
 * @param onMouseUp
 * @param onMouseMove
 * @param onMouseDown
 */
export const useMouseMoveEvent = (
	onMouseUp: (event: MouseEvent) => void,
	onMouseMove: (event: MouseEvent) => void,
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
) => {
	const [isDown, setDown] = React.useState(false);
	const handleMouseUp = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				setDown(false);
				onMouseUp(event);
			}
		},
		[onMouseUp, setDown]
	);
	const handleFocus = React.useCallback(() => {
		setDown(false);
	}, [setDown]);
	const handleMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				onMouseMove(event);
			}
		},
		[onMouseMove]
	);

	React.useEffect(() => {
		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleFocus);
		return () => {
			document.removeEventListener("focus", handleFocus);
			document.removeEventListener("blur", handleFocus);
		};
	}, [handleFocus]);

	React.useEffect(() => {
		document.addEventListener("mouseleave", handleMouseUp);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseUp]);

	React.useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	const handleDown = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
				event.preventDefault();
				setDown(true);
				onMouseDown(event);
			}
		},
		[onMouseDown, setDown]
	);

	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
export const useHandleMouseEvent = ({additionalAngle, contentRef, initialRotation, isRotatable}) =>
	React.useCallback(
		(event: React.MouseEvent<HTMLElement> | MouseEvent, init?: boolean) => {
			if (
				!isRotatable ||
				!contentRef ||
				!(contentRef as React.RefObject<HTMLElement>).current
			) {
				return false;
			}
			const {clientX, clientY} = event;
			const {left, top, width, height} = (contentRef as React.RefObject<
				HTMLElement
			>).current.getBoundingClientRect();
			const pointer = {x: clientX - left, y: clientY - top};
			const center = {x: width / 2, y: height / 2};
			const deg = coordinatesToDeg(pointer, center);
			const newRotationZ = to360(initialRotation.z + (deg - additionalAngle.z));
			const newRotation = (state: Mops.RotationModel) => ({
				x: state.x,
				y: state.y,
				z: init
					? to360(initialRotation.z)
					: event.shiftKey
					? Math.round(newRotationZ / 15) * 15
					: newRotationZ
			});
			return {
				deg,
				rotation: newRotation
			};
		},
		[contentRef, initialRotation, isRotatable]
	);
export const useHandleMouse = ({
	currentRotation,
	currentSize,
	initialPosition,
	shouldSnap,
	guideRequests,
	guides,
	hideGuides,
	showGuides
}) =>
	React.useCallback(
		({x, y}) => {
			const newPosition = {
				x: initialPosition.x + x,
				y: initialPosition.y + y
			};
			return shouldSnap.reduce(
				(model, fn) => ({
					...(fn(
						{
							position: newPosition,
							rotation: currentRotation,
							size: getBoundingBox({
								...currentSize,
								angle: degToRad(currentRotation.z)
							})
						},
						{guideRequests, guides, hideGuides, showGuides},
						model
					) as Mops.SnapHandler)
				}),
				newPosition
			) as Mops.PositionModel;
		},
		[currentSize, currentRotation, initialPosition, shouldSnap, showGuides, hideGuides]
	);
