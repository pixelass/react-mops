import React from "react";
import {cartesianToPolar, to360} from "../utils";
import {usePointer} from "./pointer";

const useCartesianToPolar = (callback, node, deps) =>
	React.useCallback(
		({x, y}, event) => {
			if (!node) {
				return;
			}
			if (x === undefined || y === undefined) {
				return callback();
			}
			const {top, left, height, width} = node.getBoundingClientRect();
			const {deg} = cartesianToPolar({
				x: x - left - width / 2,
				y: y - top - height / 2
			});
			callback(deg);
		},
		[node, callback, ...deps]
	);

export const useRotation = (
	node: HTMLElement | undefined,
	{onRotateStart, onRotate, onRotateEnd},
	initialState: number = 0
) => {
	const [initialRotation, setInitialRotation] = React.useState<number>(initialState);
	const [rotation, setRotation] = React.useState<number>(initialRotation);
	const handleMove = useCartesianToPolar(
		newRotation => {
			const deg = to360(newRotation - initialRotation);
			setRotation(deg);
			if (onRotate) {
				onRotate(deg);
			}
		},
		node,
		[onRotate]
	);
	const handleUp = useCartesianToPolar(
		(newRotation: number) => {
			const deg = newRotation !== undefined ? to360(newRotation - initialRotation) : rotation;
			setRotation(deg);
			if (onRotateEnd) {
				onRotateEnd(deg);
			}
		},
		node,
		[onRotateEnd]
	);
	const onMouseMove = React.useCallback(
		(event: MouseEvent) => handleMove({x: event.clientX, y: event.clientY}, event),
		[handleMove]
	);
	const onTouchMove = React.useCallback(
		(event: TouchEvent) =>
			handleMove({x: event.touches[0].clientX, y: event.touches[0].clientY}, event),
		[handleMove]
	);
	const handleDown = useCartesianToPolar(
		deg => {
			setInitialRotation(deg);
			if (onRotateStart) {
				onRotateStart(deg);
			}
		},
		node,
		[onRotateStart]
	);
	const onMouseDown = React.useCallback(
		(event: React.MouseEvent) => {
			setDown(true);
			handleDown({x: event.clientX, y: event.clientY}, event);
		},
		[handleDown]
	);
	const onTouchStart = React.useCallback(
		(event: React.TouchEvent) => {
			setDown(true);
			handleDown({x: event.touches[0].clientX, y: event.touches[0].clientY}, event);
		},
		[handleDown]
	);
	const onMouseUp = React.useCallback(
		(event: MouseEvent) => {
			handleUp({x: event.clientX, y: event.clientY}, event);
		},
		[handleUp]
	);
	const onTouchEnd = React.useCallback(
		(event: TouchEvent) => {
			handleUp(rotation, event);
		},
		[handleUp]
	);
	const setDown = usePointer({
		onMouseMove,
		onMouseUp,
		onTouchEnd,
		onTouchMove
	}) as React.Dispatch<React.SetStateAction<boolean>>;
	return [rotation, {onMouseDown, onTouchStart}] as [
		number,
		{
			onMouseDown?: (event: React.MouseEvent) => void;
			onTouchStart?: (event: React.TouchEvent) => void;
		}
	];
};
