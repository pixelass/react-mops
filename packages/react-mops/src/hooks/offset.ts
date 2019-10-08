import React from "react";
import {usePointer} from "./pointer";

export const useOffset = ({onDragStart, onDrag, onDragEnd}, initialState = {x: 0, y: 0}) => {
	const [initialOffset, setInitialOffset] = React.useState<{x: number; y: number}>(initialState);
	const [offset, setOffset] = React.useState<{x: number; y: number}>(initialOffset);
	const handleMove = React.useCallback(
		pointer => {
			const coords = {
				x: pointer.x - initialOffset.x,
				y: pointer.y - initialOffset.y
			};
			setOffset(coords);
			onDrag(coords);
		},
		[setOffset, initialOffset, onDrag]
	);
	const onMouseMove = React.useCallback(
		(event: MouseEvent) => {
			event.preventDefault();
			handleMove({x: event.clientX, y: event.clientY});
		},
		[handleMove]
	);
	const onTouchMove = React.useCallback(
		(event: TouchEvent) => {
			event.preventDefault();
			handleMove({x: event.touches[0].clientX, y: event.touches[0].clientY});
		},
		[handleMove]
	);
	const handleUp = React.useCallback(
		pointer => {
			const coords = {
				x: pointer.x - initialOffset.x,
				y: pointer.y - initialOffset.y
			};
			setOffset(coords);
			onDragEnd(coords);
		},
		[setOffset, initialOffset, onDragEnd]
	);
	const onMouseUp = React.useCallback(
		(event: MouseEvent) => {
			handleUp({x: event.clientX, y: event.clientY});
		},
		[handleUp]
	);
	const onTouchEnd = React.useCallback(
		(event: TouchEvent) => {
			handleUp({x: event.touches[0].clientX, y: event.touches[0].clientY});
		},
		[handleUp]
	);
	const handleDown = React.useCallback(
		pointer => {
			setDown(true);
			setInitialOffset(pointer);
			onDragStart({x: 0, y: 0});
		},
		[setInitialOffset, onDragStart]
	);
	const onMouseDown = React.useCallback(
		(event: React.MouseEvent) => {
			handleDown({x: event.clientX, y: event.clientY});
		},
		[handleDown]
	);
	const onTouchStart = React.useCallback(
		(event: React.TouchEvent) => {
			handleDown({x: event.touches[0].clientX, y: event.touches[0].clientY});
		},
		[handleDown]
	);
	const setDown = usePointer({
		onMouseMove,
		onMouseUp,
		onTouchEnd,
		onTouchMove
	}) as React.Dispatch<React.SetStateAction<boolean>>;
	return [offset, {onMouseDown, onTouchStart}] as [
		{x: number; y: number},
		{
			onMouseDown?: (event: React.MouseEvent) => void;
			onTouchStart?: (event: React.TouchEvent) => void;
		}
	];
};
