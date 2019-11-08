import React from "react";
import {Mops} from "../types";
import {withRotation} from "../utils";
import {useOffset} from "./offset";

export const useSize: Mops.UseSize = (
	initialState,
	{
		centered,
		deg = 0,
		dir = {x: 1, y: 1},
		onResize,
		onResizeEnd,
		onResizeStart,
		initialPosition,
		setInitialPosition,
		setPosition
	}
) => {
	const [initialSize, setInitialSize] = React.useState(initialState);
	const [size, setSize] = React.useState<Mops.SizeModel>(initialSize);
	const setValues = React.useCallback(
		({x, y}, end = false) => {
			const {x: rX, y: rY} = withRotation(x, y, deg);
			const sizeOffset = {
				height: initialSize.height + rY * dir.y * (centered ? 2 : 1),
				width: initialSize.width + rX * dir.x * (centered ? 2 : 1)
			};
			const newSize = {
				height: Math.abs(sizeOffset.height),
				width: Math.abs(sizeOffset.width)
			};
			const {x: dX, y: dY} = withRotation(
				centered || dir.x === 0 ? 0 : rX,
				centered || dir.y === 0 ? 0 : rY,
				-deg
			);
			const newPosition = {
				x: initialPosition.x + dX / 2,
				y: initialPosition.y + dY / 2
			};
			if (setPosition) {
				setPosition(newPosition);
			}
			setSize(newSize);
			if (end) {
				setInitialSize(newSize);
				if (setInitialPosition) {
					setInitialPosition(newPosition);
				}
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
		(offset: Mops.PositionModel) => {
			setValues(offset);
		},
		[setValues]
	);
	const handleDragEnd = React.useCallback(
		(offset: Mops.PositionModel) => {
			setValues(offset, true);
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
	return [size, {...methods, setSize, setInitialSize}];
};
