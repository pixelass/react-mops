import React from "react";
import {Mops} from "../types";
import {withRotation} from "../utils";
import {useOffset} from "./offset";

interface Position {
	y: number;
	x: number;
}
export interface Dir {
	y: -1 | 1 | 0;
	x: -1 | 1 | 0;
}
interface Size {
	height: number;
	width: number;
}
interface Props {
	dir?: Dir;
	minHeight?: number;
	minWidth?: number;
	centered?: boolean;
	deg?: number;
	initialPosition?: Position;
	onResizeEnd?: (o: Partial<Mops.BoundingBox>) => void;
	onResizeStart?: (o: Partial<Mops.BoundingBox>) => void;
	onResize?: (o: Partial<Mops.BoundingBox>) => void;
	setPosition?: React.Dispatch<React.SetStateAction<Position>>;
	setInitialPosition?: React.Dispatch<React.SetStateAction<Position>>;
}
export const useSize = (
	initialState: Size,
	{
		centered,
		deg = 0,
		dir = {x: 1, y: 1},
		minHeight,
		minWidth,
		onResize,
		onResizeEnd,
		onResizeStart,
		initialPosition,
		setInitialPosition,
		setPosition
	}: Props
) => {
	const [initialSize, setInitialSize] = React.useState(initialState);
	const [size, setSize] = React.useState(initialSize);
	const setValues = React.useCallback(
		(o, end = false) => {
			const r = withRotation(o.x, o.y, deg);
			const sizeOffset = {
				height: initialSize.height + r.y * dir.y * (centered ? 2 : 1),
				width: initialSize.width + r.x * dir.x * (centered ? 2 : 1)
			};
			const newSize = {
				height: Math.abs(sizeOffset.height),
				width: Math.abs(sizeOffset.width)
			};
			const d = withRotation(
				centered || dir.x === 0 ? 0 : r.x,
				centered || dir.y === 0 ? 0 : r.y,
				-deg
			);
			const newPosition = {
				x: initialPosition.x + d.x / 2,
				y: initialPosition.y + d.y / 2
			};
			setPosition(newPosition);
			setSize(newSize);
			if (end) {
				setInitialSize(newSize);
				setInitialPosition(newPosition);
				if (onResizeEnd) {
					onResizeEnd({
						size: newSize
					});
				}
			} else {
				if (onResize) {
					onResize({
						size: newSize
					});
				}
			}
		},
		[
			centered,
			initialSize,
			setSize,
			setInitialSize,
			dir,
			deg,
			setPosition,
			onResizeEnd,
			onResize,
			initialPosition,
			setInitialPosition
		]
	);

	const handleDrag = React.useCallback(
		o => {
			setValues(o);
		},
		[setValues]
	);
	const handleDragEnd = React.useCallback(
		o => {
			setValues(o, true);
		},
		[setValues]
	);
	const handleDragStart = React.useCallback(() => {
		if (onResizeStart) {
			onResizeStart({
				size: initialSize
			});
		}
	}, [onResizeStart]);
	const [, methods] = useOffset({
		onDrag: handleDrag,
		onDragEnd: handleDragEnd,
		onDragStart: handleDragStart
	});
	return [size, methods] as [
		Size,
		{
			onMouseDown?: (event: React.MouseEvent) => void;
			onTouchStart?: (event: React.TouchEvent) => void;
		}
	];
};
